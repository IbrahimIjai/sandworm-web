// eslint-disable-next-line import/no-extraneous-dependencies

import "dotenv/config";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { QueryTable, users as UserTable } from "@/database/schemas";

const queries = [
  `SELECT id, name, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;`,
  `SELECT orders.id, users.name, orders.total_price 
   FROM orders 
   JOIN users ON orders.user_id = users.id 
   WHERE orders.status = 'completed' 
   ORDER BY orders.created_at DESC LIMIT 20;`,
  `SELECT products.id, products.name, categories.name AS category_name 
   FROM products 
   JOIN categories ON products.category_id = categories.id 
   WHERE products.stock > 0 
   ORDER BY products.name ASC;`,
  `SELECT employees.id, employees.name, departments.name AS department, roles.name AS role 
   FROM employees 
   JOIN departments ON employees.department_id = departments.id 
   JOIN roles ON employees.role_id = roles.id 
   WHERE employees.status = 'active';`,
  `SELECT customers.id, customers.name, SUM(orders.total_price) AS total_spent 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY total_spent DESC LIMIT 5;`,
  `SELECT books.id, books.title, authors.name AS author, publishers.name AS publisher 
   FROM books 
   JOIN authors ON books.author_id = authors.id 
   JOIN publishers ON books.publisher_id = publishers.id 
   WHERE books.published_date > '2020-01-01';`,
  `SELECT posts.id, posts.title, users.username, COUNT(comments.id) AS comment_count 
   FROM posts 
   LEFT JOIN comments ON posts.id = comments.post_id 
   JOIN users ON posts.user_id = users.id 
   GROUP BY posts.id, posts.title, users.username 
   ORDER BY comment_count DESC;`,
  `SELECT employees.name, projects.title 
   FROM employees 
   JOIN project_assignments ON employees.id = project_assignments.employee_id 
  JOIN projects ON project_assignments.project_id = projects.id 
   WHERE projects.deadline > NOW();`,
  `SELECT movies.title, directors.name AS director, COUNT(actors.id) AS actor_count 
   FROM movies 
   JOIN directors ON movies.director_id = directors.id 
   JOIN movie_cast ON movies.id = movie_cast.movie_id 
   JOIN actors ON movie_cast.actor_id = actors.id 
   GROUP BY movies.id, movies.title, directors.name;`,
  `SELECT students.name, courses.title 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   JOIN courses ON enrollments.course_id = courses.id 
   WHERE enrollments.completed = true 
   ORDER BY students.name ASC;`,
  `SELECT customers.id, customers.name, AVG(orders.total_price) AS avg_spent 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY avg_spent DESC LIMIT 10;`,
  `SELECT products.id, products.name, SUM(orders.total_price) AS total_sales 
   FROM products 
   JOIN orders ON products.id = orders.product_id 
   WHERE orders.status = 'completed' 
   GROUP BY products.id, products.name 
   ORDER BY total_sales DESC LIMIT 5;`,
  `SELECT students.name, COUNT(enrollments.course_id) AS enrolled_courses 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   GROUP BY students.id, students.name 
   ORDER BY enrolled_courses DESC;`,
  `SELECT employees.name, SUM(projects.budget) AS total_budget 
   FROM employees 
   JOIN project_assignments ON employees.id = project_assignments.employee_id 
   JOIN projects ON project_assignments.project_id = projects.id 
   GROUP BY employees.id, employees.name 
   ORDER BY total_budget DESC;`,
  `SELECT orders.id, orders.status, COUNT(products.id) AS product_count 
   FROM orders 
   LEFT JOIN order_items ON orders.id = order_items.order_id 
   LEFT JOIN products ON order_items.product_id = products.id 
   GROUP BY orders.id, orders.status 
   ORDER BY product_count DESC LIMIT 10;`,
  `SELECT employees.id, employees.name, projects.title AS project_title 
   FROM employees 
   JOIN project_assignments ON employees.id = project_assignments.employee_id 
   JOIN projects ON project_assignments.project_id = projects.id 
   WHERE projects.start_date > '2023-01-01';`,
  `SELECT books.id, books.title, AVG(reviews.rating) AS avg_rating 
   FROM books 
   LEFT JOIN reviews ON books.id = reviews.book_id 
   GROUP BY books.id, books.title 
   ORDER BY avg_rating DESC LIMIT 10;`,
  `SELECT movies.title, COUNT(distinct actors.id) AS unique_actors 
   FROM movies 
   JOIN movie_cast ON movies.id = movie_cast.movie_id 
   JOIN actors ON movie_cast.actor_id = actors.id 
   GROUP BY movies.id, movies.title 
   ORDER BY unique_actors DESC;`,
  `SELECT customers.id, customers.name, MAX(orders.total_price) AS max_order 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY max_order DESC LIMIT 5;`,
  `SELECT employees.name, roles.name AS role, SUM(projects.budget) AS total_budget 
   FROM employees 
   JOIN roles ON employees.role_id = roles.id 
   JOIN project_assignments ON employees.id = project_assignments.employee_id 
   JOIN projects ON project_assignments.project_id = projects.id 
   GROUP BY employees.id, employees.name, roles.name;`,
  `SELECT students.name, courses.title, enrollments.completed 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   JOIN courses ON enrollments.course_id = courses.id 
   ORDER BY students.name ASC;`,
  `SELECT products.name, categories.name AS category, COUNT(orders.id) AS order_count 
   FROM products 
   JOIN categories ON products.category_id = categories.id 
   LEFT JOIN order_items ON products.id = order_items.product_id 
   LEFT JOIN orders ON order_items.order_id = orders.id 
   GROUP BY products.id, products.name, categories.name 
   ORDER BY order_count DESC;`,
  `SELECT posts.title, COUNT(likes.id) AS like_count 
   FROM posts 
   LEFT JOIN likes ON posts.id = likes.post_id 
   GROUP BY posts.id, posts.title 
   ORDER BY like_count DESC LIMIT 10;`,
  `SELECT customers.id, customers.name, COUNT(orders.id) AS total_orders 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY total_orders DESC LIMIT 10;`,
  `SELECT movies.title, COUNT(distinct reviews.id) AS review_count 
   FROM movies 
   LEFT JOIN reviews ON movies.id = reviews.movie_id 
   GROUP BY movies.id, movies.title 
   ORDER BY review_count DESC;`,
  `SELECT employees.name, departments.name AS department_name 
   FROM employees 
   JOIN departments ON employees.department_id = departments.id 
   WHERE employees.status = 'active' AND departments.name = 'Engineering';`,
  `SELECT books.title, authors.name AS author, COUNT(borrowers.id) AS borrow_count 
   FROM books 
   JOIN authors ON books.author_id = authors.id 
   LEFT JOIN borrowings ON books.id = borrowings.book_id 
   LEFT JOIN borrowers ON borrowings.borrower_id = borrowers.id 
   GROUP BY books.id, books.title, authors.name 
   ORDER BY borrow_count DESC LIMIT 5;`,
  `SELECT students.name, courses.title, AVG(grades.score) AS average_grade 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   JOIN courses ON enrollments.course_id = courses.id 
   JOIN grades ON enrollments.id = grades.enrollment_id 
   GROUP BY students.id, students.name, courses.title 
   ORDER BY average_grade DESC LIMIT 10;`,
  `SELECT customers.id, customers.name, AVG(orders.total_price) AS avg_order_value 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY avg_order_value DESC LIMIT 5;`,
  `SELECT products.name, categories.name AS category, AVG(products.price) AS avg_price 
   FROM products 
   JOIN categories ON products.category_id = categories.id 
   GROUP BY products.id, products.name, categories.name 
   ORDER BY avg_price DESC LIMIT 5;`,
  `SELECT posts.id, posts.title, COUNT(likes.id) AS like_count 
   FROM posts 
   LEFT JOIN likes ON posts.id = likes.post_id 
   GROUP BY posts.id, posts.title 
   ORDER BY like_count DESC LIMIT 5;`,
  `SELECT orders.id, orders.status, SUM(order_items.quantity * order_items.price) AS total_value 
   FROM orders 
   JOIN order_items ON orders.id = order_items.order_id 
   GROUP BY orders.id, orders.status 
   ORDER BY total_value DESC LIMIT 5;`,
  `SELECT students.name, AVG(grades.score) AS avg_score 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   JOIN grades ON enrollments.id = grades.enrollment_id 
   GROUP BY students.id, students.name 
   ORDER BY avg_score DESC LIMIT 10;`,
  `SELECT employees.name, COUNT(DISTINCT project_assignments.project_id) AS project_count 
   FROM employees 
   LEFT JOIN project_assignments ON employees.id = project_assignments.employee_id 
   GROUP BY employees.id, employees.name 
   ORDER BY project_count DESC LIMIT 10;`,
  `SELECT products.name, COUNT(order_items.id) AS order_count 
   FROM products 
   LEFT JOIN order_items ON products.id`,
  `SELECT id, name, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;`,
  `SELECT orders.id, users.name, orders.total_price 
   FROM orders 
   JOIN users ON orders.user_id = users.id 
   WHERE orders.status = 'completed' 
   ORDER BY orders.created_at DESC LIMIT 20;`,
  `SELECT products.id, products.name, categories.name AS category_name 
   FROM products 
   JOIN categories ON products.category_id = categories.id 
   WHERE products.stock > 0 
   ORDER BY products.name ASC;`,
  `SELECT employees.id, employees.name, departments.name AS department, roles.name AS role 
   FROM employees 
   JOIN departments ON employees.department_id = departments.id 
   JOIN roles ON employees.role_id = roles.id 
   WHERE employees.status = 'active';`,
  `SELECT customers.id, customers.name, SUM(orders.total_price) AS total_spent 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY total_spent DESC LIMIT 5;`,
  `SELECT books.id, books.title, authors.name AS author, publishers.name AS publisher 
   FROM books 
   JOIN authors ON books.author_id = authors.id 
   JOIN publishers ON books.publisher_id = publishers.id 
   WHERE books.published_date > '2020-01-01';`,
  `SELECT posts.id, posts.title, users.username, COUNT(comments.id) AS comment_count 
   FROM posts 
   LEFT JOIN comments ON posts.id = comments.post_id 
   JOIN users ON posts.user_id = users.id 
   GROUP BY posts.id, posts.title, users.username 
   ORDER BY comment_count DESC;`,
  `SELECT employees.name, projects.title 
   FROM employees 
   JOIN project_assignments ON employees.id = project_assignments.employee_id 
   JOIN projects ON project_assignments.project_id = projects.id 
   WHERE projects.deadline > NOW();`,
  `SELECT movies.title, directors.name AS director, COUNT(actors.id) AS actor_count 
   FROM movies 
   JOIN directors ON movies.director_id = directors.id 
   JOIN movie_cast ON movies.id = movie_cast.movie_id 
   JOIN actors ON movie_cast.actor_id = actors.id 
   GROUP BY movies.id, movies.title, directors.name;`,
  `SELECT students.name, courses.title 
   FROM students 
   JOIN enrollments ON students.id = enrollments.student_id 
   JOIN courses ON enrollments.course_id = courses.id 
   WHERE enrollments.completed = true 
   ORDER BY students.name ASC;`,
  `SELECT id, name, email FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;`,
  `SELECT orders.id, users.name, orders.total_price 
   FROM orders 
   JOIN users ON orders.user_id = users.id 
   WHERE orders.status = 'completed' 
   ORDER BY orders.created_at DESC LIMIT 20;`,
  `SELECT products.id, products.name, categories.name AS category_name 
   FROM products 
   JOIN categories ON products.category_id = categories.id 
   WHERE products.stock > 0 
   ORDER BY products.name ASC;`,
  `SELECT employees.id, employees.name, departments.name AS department, roles.name AS role 
   FROM employees 
   JOIN departments ON employees.department_id = departments.id 
   JOIN roles ON employees.role_id = roles.id 
   WHERE employees.status = 'active';`,
  `SELECT customers.id, customers.name, SUM(orders.total_price) AS total_spent 
   FROM customers 
   JOIN orders ON customers.id = orders.customer_id 
   GROUP BY customers.id, customers.name 
   ORDER BY total_spent DESC LIMIT 5;`,
  `SELECT books.id, books.title, authors.name AS author, publishers.name AS publisher 
   FROM books 
   JOIN authors ON books.author_id = authors.id 
   JOIN publishers ON books.publisher_id = publishers.id;`,
];

async function seedDatabase() {
  console.log(process.env);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);
  await db.delete(UserTable);
  await db.delete(QueryTable);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(UserTable);

  if (count > 0) {
    console.log("Database already has data. Skipping seed.");
    return;
  }

  // Generate 20 random users
  const fakerUsers = Array.from({ length: 20 }, () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  }));

  await db.insert(UserTable).values(fakerUsers);
  const users = await db.select().from(UserTable);
  const validUsers = users.filter(user => user !== null);
  if (validUsers.length === 0) {
    console.error("No valid users created. Cannot proceed.");
    return;
  }

  let fakerQueries = queries
    .map((query, index) => {
      const user = validUsers[index % validUsers.length]; // Ensure user exists
      if (!user || !user.id) return null;
      if (!user) return null;
      return {
        title: faker.lorem.sentence(), // Random title
        description: faker.lorem.paragraph(), // Random description
        creator_id: user.id,
        query,
        tags: faker.lorem.words(3).split(" "), // Random tags
        forked_from_id: null,
      };
    })
    .filter((q): q is NonNullable<typeof q> => !!q);
  fakerQueries = fakerQueries.filter(user => user !== null);
  console.log(fakerQueries);
  await db.insert(QueryTable).values(fakerQueries);
  const queriesResult = await db.select().from(QueryTable);
  const validQueries = queriesResult.filter(user => user !== null);

  if (validQueries.length === 0) {
    console.error("No valid queries created. Cannot proceed.");
  }

  const starsQuery = validQueries.map(query => {
    const starCount = faker.number.int({ min: 5, max: 8 });
    const selectedUsers = faker.helpers
      .shuffle(validUsers)
      .slice(0, starCount)
      .map(u => u.id);
    return { user: selectedUsers, query: query.id };
  });

  console.log(starsQuery);

  const randomUser = users[Math.floor(Math.random() * users.length)];
  console.log("Random user:", randomUser);
  console.log("Database seeded successfully.");
}

seedDatabase();
