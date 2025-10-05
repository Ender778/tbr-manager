-- Simple function that just deletes and re-creates positions to avoid conflicts
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
  other_positions RECORD;
  counter INTEGER := 0;
BEGIN
  -- Step 1: Remove the moving book temporarily
  DELETE FROM book_positions 
  WHERE book_id = p_book_id AND user_id = p_user_id;
  
  -- Step 2: For different shelves, clean up source shelf
  IF p_from_shelf_id != p_to_shelf_id THEN
    -- Renumber source shelf positions
    FOR other_positions IN 
      SELECT id FROM book_positions 
      WHERE shelf_id = p_from_shelf_id AND user_id = p_user_id 
      ORDER BY position
    LOOP
      UPDATE book_positions 
      SET position = counter, updated_at = NOW()
      WHERE id = other_positions.id;
      counter := counter + 1;
    END LOOP;
  END IF;
  
  -- Step 3: Make room in target shelf and renumber
  counter := 0;
  FOR other_positions IN 
    SELECT id FROM book_positions 
    WHERE shelf_id = p_to_shelf_id AND user_id = p_user_id 
    ORDER BY position
  LOOP
    IF counter = p_new_position THEN
      counter := counter + 1; -- Skip the slot for our book
    END IF;
    UPDATE book_positions 
    SET position = counter, updated_at = NOW()
    WHERE id = other_positions.id;
    counter := counter + 1;
  END LOOP;
  
  -- Step 4: Insert the book at its new position
  INSERT INTO book_positions (book_id, shelf_id, position, user_id, created_at, updated_at)
  VALUES (p_book_id, p_to_shelf_id, p_new_position, p_user_id, NOW(), NOW())
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