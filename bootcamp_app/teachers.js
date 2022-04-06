const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'bootcampx'
});

const queryString = `
SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort
FROM assistance_requests
JOIN teachers ON teachers.id = assistance_requests.teacher_id
JOIN students ON students.id = assistance_requests.student_id
JOIN cohorts ON cohorts.id = students.cohort_id
WHERE cohorts.name LIKE $1
ORDER BY teacher
LIMIT $2;
`;

const cohortName = process.argv[2];
const limit = process.argv[3];
const values = [`%${cohortName}%`, limit]

pool.query(queryString, values)
.then(res => {
  res.rows.forEach(teacher => {
    console.log(`${teacher.teacher} assisted the ${teacher.cohort} cohort`);
    pool.end();
  })
})
.catch(err => console.error('query error', err.stack));
