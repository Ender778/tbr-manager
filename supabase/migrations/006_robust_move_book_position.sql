-- Ultra-robust function that completely avoids constraint conflicts
CREATE OR REPLACE FUNCTION move_book_position(
  p_book_id UUID,
  p_user_id UUID,
  p_from_shelf_id UUID,
  p_to_shelf_id UUID,
  p_new_position INTEGER,
  p_current_position INTEGER
) RETURNS JSONB AS $$
DECLARE
  book_position_record RECORD;
  temp_position INTEGER := -999999; -- Use extreme negative to avoid conflicts
BEGIN
  -- Step 1: Move book to safe temp position
  UPDATE book_positions 
  SET position = temp_position, updated_at = NOW()
  WHERE book_id = p_book_id AND user_id = p_user_id;
  
  -- Step 2: Handle different shelf vs same shelf
  IF p_from_shelf_id != p_to_shelf_id THEN
    -- Different shelf: renumber source shelf positions to close gap
    UPDATE book_positions 
    SET position = ROW_NUMBER() OVER (ORDER BY position) - 1, updated_at = NOW()
    WHERE shelf_id = p_from_shelf_id 
      AND user_id = p_user_id 
      AND position != temp_position;
    
    -- Different shelf: renumber target shelf positions to make room
    WITH target_books AS (
      SELECT id, position,
             CASE 
               WHEN position >= p_new_position THEN position + 1
               ELSE position
             END as new_position
      FROM book_positions 
      WHERE shelf_id = p_to_shelf_id 
        AND user_id = p_user_id 
        AND position != temp_position
    )
    UPDATE book_positions 
    SET position = target_books.new_position, updated_at = NOW()
    FROM target_books 
    WHERE book_positions.id = target_books.id;
    
  ELSE
    -- Same shelf: renumber all positions except the moving book
    WITH reordered AS (
      SELECT id, position,
             CASE 
               WHEN position < LEAST(p_current_position, p_new_position) THEN position
               WHEN position > GREATEST(p_current_position, p_new_position) THEN position
               WHEN p_new_position > p_current_position AND position > p_current_position THEN position - 1
               WHEN p_new_position < p_current_position AND position < p_current_position THEN position + 1
               ELSE position
             END as new_position
      FROM book_positions 
      WHERE shelf_id = p_to_shelf_id 
        AND user_id = p_user_id 
        AND position != temp_position
    )
    UPDATE book_positions 
    SET position = reordered.new_position, updated_at = NOW()
    FROM reordered 
    WHERE book_positions.id = reordered.id 
      AND book_positions.position != reordered.new_position;
  END IF;
  
  -- Step 3: Move book to final position
  UPDATE book_positions 
  SET 
    shelf_id = p_to_shelf_id,
    position = p_new_position,
    updated_at = NOW()
  WHERE book_id = p_book_id AND user_id = p_user_id
  RETURNING * INTO book_position_record;
  
  RETURN jsonb_build_object(
    'id', book_position_record.id,
    'book_id', book_position_record.book_id,
    'shelf_id', book_position_record.shelf_id,
    'position', book_position_record.position,
    'updated_at', book_position_record.updated_at
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', true,
    'message', SQLERRM,
    'code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;