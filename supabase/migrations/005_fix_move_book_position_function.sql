-- Fixed function to atomically move a book position while handling conflicts
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
  max_temp_position INTEGER;
BEGIN
  -- Use a very negative temp position to avoid conflicts
  SELECT COALESCE(MIN(position), 0) - 1000 INTO max_temp_position
  FROM book_positions 
  WHERE user_id = p_user_id;
  
  -- First, move the book to a temporary position to avoid conflicts
  UPDATE book_positions 
  SET position = max_temp_position, updated_at = NOW()
  WHERE book_id = p_book_id 
    AND user_id = p_user_id;
  
  -- If moving to a different shelf
  IF p_from_shelf_id != p_to_shelf_id THEN
    -- Shift positions on the source shelf (close the gap)
    UPDATE book_positions 
    SET position = position - 1, updated_at = NOW()
    WHERE shelf_id = p_from_shelf_id 
      AND user_id = p_user_id
      AND position > p_current_position;
      
    -- Shift positions on the target shelf (make room)
    UPDATE book_positions 
    SET position = position + 1, updated_at = NOW()
    WHERE shelf_id = p_to_shelf_id 
      AND user_id = p_user_id
      AND position >= p_new_position;
  ELSE
    -- Moving within the same shelf
    IF p_new_position > p_current_position THEN
      -- Moving down: shift positions between current and new position up by 1
      UPDATE book_positions 
      SET position = position - 1, updated_at = NOW()
      WHERE shelf_id = p_to_shelf_id 
        AND user_id = p_user_id
        AND position > p_current_position 
        AND position <= p_new_position;
    ELSIF p_new_position < p_current_position THEN
      -- Moving up: shift positions between new and current position down by 1
      UPDATE book_positions 
      SET position = position + 1, updated_at = NOW()
      WHERE shelf_id = p_to_shelf_id 
        AND user_id = p_user_id
        AND position >= p_new_position 
        AND position < p_current_position;
    -- If p_new_position = p_current_position, no shifting needed
    END IF;
  END IF;
  
  -- Finally, move the book to its new position
  UPDATE book_positions 
  SET 
    shelf_id = p_to_shelf_id,
    position = p_new_position,
    updated_at = NOW()
  WHERE book_id = p_book_id 
    AND user_id = p_user_id
  RETURNING * INTO book_position_record;
  
  -- Return the updated position data
  RETURN jsonb_build_object(
    'id', book_position_record.id,
    'book_id', book_position_record.book_id,
    'shelf_id', book_position_record.shelf_id,
    'position', book_position_record.position,
    'updated_at', book_position_record.updated_at
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Return error information
  RETURN jsonb_build_object(
    'error', true,
    'message', SQLERRM,
    'code', SQLSTATE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION move_book_position TO authenticated;