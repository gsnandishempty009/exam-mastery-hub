-- Insert dummy data for branches
INSERT INTO branches (name, code, description) VALUES
('Computer Science & Engineering', 'CSE', 'Computer Science and Engineering branch'),
('Electronics & Communication Engineering', 'ECE', 'Electronics and Communication Engineering branch'),
('Mechanical Engineering', 'ME', 'Mechanical Engineering branch'),
('Civil Engineering', 'CE', 'Civil Engineering branch'),
('Electrical Engineering', 'EE', 'Electrical Engineering branch')
ON CONFLICT DO NOTHING;

-- Insert dummy data for subjects
INSERT INTO subjects (name, code, branch_id) VALUES
('Data Structures', 'CS101', (SELECT id FROM branches WHERE code = 'CSE' LIMIT 1)),
('Database Management Systems', 'CS201', (SELECT id FROM branches WHERE code = 'CSE' LIMIT 1)),
('Web Development', 'CS301', (SELECT id FROM branches WHERE code = 'CSE' LIMIT 1)),
('Artificial Intelligence', 'CS401', (SELECT id FROM branches WHERE code = 'CSE' LIMIT 1)),
('Digital Signal Processing', 'EC101', (SELECT id FROM branches WHERE code = 'ECE' LIMIT 1)),
('Microprocessors', 'EC201', (SELECT id FROM branches WHERE code = 'ECE' LIMIT 1)),
('Thermodynamics', 'ME101', (SELECT id FROM branches WHERE code = 'ME' LIMIT 1)),
('Mechanical Design', 'ME201', (SELECT id FROM branches WHERE code = 'ME' LIMIT 1)),
('Structural Analysis', 'CE101', (SELECT id FROM branches WHERE code = 'CE' LIMIT 1)),
('Concrete Technology', 'CE201', (SELECT id FROM branches WHERE code = 'CE' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert dummy data for modules
INSERT INTO modules (subject_id, title, description, chapter_number) VALUES
((SELECT id FROM subjects WHERE code = 'CS101' LIMIT 1), 'Arrays and Linked Lists', 'Learn about fundamental data structures', 1),
((SELECT id FROM subjects WHERE code = 'CS101' LIMIT 1), 'Stacks and Queues', 'Understand stack and queue operations', 2),
((SELECT id FROM subjects WHERE code = 'CS101' LIMIT 1), 'Trees and Graphs', 'Master tree and graph traversals', 3),
((SELECT id FROM subjects WHERE code = 'CS201' LIMIT 1), 'Relational Database Design', 'Learn normalization and schema design', 1),
((SELECT id FROM subjects WHERE code = 'CS201' LIMIT 1), 'SQL Queries', 'Master SQL fundamentals', 2),
((SELECT id FROM subjects WHERE code = 'CS301' LIMIT 1), 'HTML & CSS Basics', 'Learn web markup and styling', 1),
((SELECT id FROM subjects WHERE code = 'CS301' LIMIT 1), 'JavaScript Fundamentals', 'Understand JavaScript programming', 2),
((SELECT id FROM subjects WHERE code = 'CS401' LIMIT 1), 'Machine Learning Basics', 'Introduction to ML concepts', 1),
((SELECT id FROM subjects WHERE code = 'EC101' LIMIT 1), 'Signal Classification', 'Classify different types of signals', 1),
((SELECT id FROM subjects WHERE code = 'ME101' LIMIT 1), 'First Law of Thermodynamics', 'Energy conservation principles', 1)
ON CONFLICT DO NOTHING;

-- Insert dummy data for question papers
INSERT INTO question_papers (module_id, title, year, semester, difficulty_level, total_marks, file_url) VALUES
((SELECT id FROM modules WHERE title = 'Arrays and Linked Lists' LIMIT 1), 'Data Structures Mid Exam 2024', 2024, 'Spring', 'Medium', 100, 'https://example.com/qp/cs101_mid_2024.pdf'),
((SELECT id FROM modules WHERE title = 'Arrays and Linked Lists' LIMIT 1), 'Data Structures Final Exam 2023', 2023, 'Spring', 'Hard', 100, 'https://example.com/qp/cs101_final_2023.pdf'),
((SELECT id FROM modules WHERE title = 'Stacks and Queues' LIMIT 1), 'Stacks and Queues Quiz 2024', 2024, 'Spring', 'Easy', 50, 'https://example.com/qp/cs101_sq_quiz_2024.pdf'),
((SELECT id FROM modules WHERE title = 'SQL Queries' LIMIT 1), 'DBMS Final Exam 2024', 2024, 'Fall', 'Medium', 100, 'https://example.com/qp/cs201_final_2024.pdf'),
((SELECT id FROM modules WHERE title = 'JavaScript Fundamentals' LIMIT 1), 'Web Dev Practical 2024', 2024, 'Spring', 'Medium', 50, 'https://example.com/qp/cs301_practical_2024.pdf'),
((SELECT id FROM modules WHERE title = 'Machine Learning Basics' LIMIT 1), 'AI Exam 2024', 2024, 'Fall', 'Hard', 100, 'https://example.com/qp/cs401_exam_2024.pdf'),
((SELECT id FROM modules WHERE title = 'Signal Classification' LIMIT 1), 'DSP Mid Exam 2024', 2024, 'Spring', 'Medium', 80, 'https://example.com/qp/ec101_mid_2024.pdf'),
((SELECT id FROM modules WHERE title = 'First Law of Thermodynamics' LIMIT 1), 'Thermodynamics Final 2024', 2024, 'Spring', 'Medium', 100, 'https://example.com/qp/me101_final_2024.pdf')
ON CONFLICT DO NOTHING;

-- Insert dummy data for notes
INSERT INTO notes (module_id, title, content, created_by) VALUES
((SELECT id FROM modules WHERE title = 'Arrays and Linked Lists' LIMIT 1), 'Array Basics', 'Arrays are contiguous memory blocks that store elements of the same type. Key operations include access (O(1)), insertion (O(n)), and deletion (O(n)).', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'Arrays and Linked Lists' LIMIT 1), 'Linked List Implementation', 'Linked lists consist of nodes with data and pointers. They allow efficient insertion and deletion at O(1) if position is known. Traversal is O(n).', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'Stacks and Queues' LIMIT 1), 'Stack Operations', 'LIFO (Last In First Out) data structure. Push adds element, Pop removes the top element. Both operations are O(1).', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'Stacks and Queues' LIMIT 1), 'Queue Operations', 'FIFO (First In First Out) data structure. Enqueue adds at rear, Dequeue removes from front. Both operations are O(1).', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'Relational Database Design' LIMIT 1), 'Normalization', 'Process of organizing data to reduce redundancy. Normal forms: 1NF, 2NF, 3NF, BCNF. Each form addresses different dependency issues.', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'SQL Queries' LIMIT 1), 'SELECT Statement', 'Basic syntax: SELECT column FROM table WHERE condition. Use joins to combine multiple tables, aggregates for calculations.', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'HTML & CSS Basics' LIMIT 1), 'HTML Structure', 'HTML provides semantic structure using tags like <header>, <main>, <footer>. Forms use <form>, <input>, <button> elements.', (SELECT id FROM auth.users LIMIT 1)),
((SELECT id FROM modules WHERE title = 'JavaScript Fundamentals' LIMIT 1), 'Variables and Data Types', 'JavaScript uses var, let, const for declarations. Data types: String, Number, Boolean, Object, Array, null, undefined.', (SELECT id FROM auth.users LIMIT 1))
ON CONFLICT DO NOTHING;
