INSERT INTO roles (name) VALUES ('ADMIN');
INSERT INTO roles (name) VALUES ('TEACHER');
INSERT INTO roles (name) VALUES ('STUDENT');

INSERT INTO users (name, contact_number, email, password, status) VALUES ('Admin', '0234567890', 'admin@example.com', '$2a$10$BOraonjZ5IyehbATzupffO3ggFHJJZ8W2i6LvNolHGa.ikU7ICyTe', 'ACTIVE');
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1);

INSERT INTO users (name, contact_number, email, password, status) VALUES ('Teacher', '0234567890', 'teacher@example.com', '$2a$10$BOraonjZ5IyehbATzupffO3ggFHJJZ8W2i6LvNolHGa.ikU7ICyTe', 'ACTIVE');
INSERT INTO user_roles (user_id, role_id) VALUES (2, 2);

INSERT INTO users (name, contact_number, email, password, status) VALUES ('Student', '0234567890', 'student@example.com', '$2a$10$BOraonjZ5IyehbATzupffO3ggFHJJZ8W2i6LvNolHGa.ikU7ICyTe', 'ACTIVE');
INSERT INTO user_roles (user_id, role_id) VALUES (3, 3);