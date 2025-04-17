-- Create admin user if not exists
INSERT IGNORE INTO user (username, email, password, role) 
VALUES (
    'admin',
    'admin@sportify.com',
    '$2y$10$koY.2Pj4VJ/7j4Oo5uNMKeYToL48J0dcWwDzqSk99bGoI6E6DJAp6',
    'ADMIN'
); 