-- Drop the existing foreign key constraint if it exists
SET @constraint_name = (
        SELECT CONSTRAINT_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_NAME = 'payment'
            AND REFERENCED_TABLE_NAME = 'bookings'
            AND CONSTRAINT_SCHEMA = DATABASE()
        LIMIT 1
    );
SET @sql = IF(
        @constraint_name IS NOT NULL,
        CONCAT(
            'ALTER TABLE payment DROP FOREIGN KEY ',
            @constraint_name
        ),
        'SELECT 1'
    );
PREPARE stmt
FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
-- Add the new foreign key constraint
ALTER TABLE payment
ADD CONSTRAINT FK_payment_bookings FOREIGN KEY (booking_id) REFERENCES bookings (id);