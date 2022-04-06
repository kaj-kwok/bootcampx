const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'bootcampx'
});

pool.query(`
SELECT DISTINCT teachers.name AS teacher, cohorts.name AS cohort
FROM assistance_requests
JOIN teachers ON teachers.id = assistance_requests.teacher_id
JOIN students ON students.id = assistance_requests.student_id
JOIN cohorts ON cohorts.id = students.cohort_id
WHERE cohorts.name LIKE '%${process.argv[2]}%'
ORDER BY teacher
LIMIT ${process.argv[3] || 5};
`)
.then(res => {
  res.rows.forEach(teacher => {
    console.log(`${teacher.teacher} assisted the ${teacher.cohort} cohort`);
    pool.end();
  })
})
.catch(err => console.error('query error', err.stack));
