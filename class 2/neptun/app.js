// Data Storage
let students = [];
let classes = [];
let grades = [];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupEventListeners();
    switchView('dashboard');
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Search
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchStudents(e.target.value);
    });

    // Add buttons
    document.getElementById('add-student-btn').addEventListener('click', () => openAddStudentModal());
    document.getElementById('add-class-btn').addEventListener('click', () => openAddClassModal());
    document.getElementById('add-grade-btn').addEventListener('click', () => openAddGradeModal());

    // Modal
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

// Switch View
function switchView(viewName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    // Update title
    const titles = {
        dashboard: 'Dashboard',
        students: 'Students',
        classes: 'Classes',
        grades: 'Grades'
    };
    document.getElementById('page-title').textContent = titles[viewName];

    // Render appropriate view
    switch(viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'students':
            renderStudents();
            break;
        case 'classes':
            renderClasses();
            break;
        case 'grades':
            renderGrades();
            break;
    }
}

// Initialize Data with 50 students
function initializeData() {
    // Classes
    classes = [
        { id: 1, name: 'Computer Science 101', code: 'CS101', instructor: 'Dr. Smith', credits: 3 },
        { id: 2, name: 'Mathematics', code: 'MATH201', instructor: 'Prof. Johnson', credits: 4 },
        { id: 3, name: 'Physics', code: 'PHY101', instructor: 'Dr. Williams', credits: 3 },
        { id: 4, name: 'Chemistry', code: 'CHEM101', instructor: 'Prof. Brown', credits: 4 },
        { id: 5, name: 'English Literature', code: 'ENG201', instructor: 'Dr. Davis', credits: 3 },
        { id: 6, name: 'History', code: 'HIST101', instructor: 'Prof. Miller', credits: 3 },
        { id: 7, name: 'Biology', code: 'BIO101', instructor: 'Dr. Wilson', credits: 4 },
        { id: 8, name: 'Economics', code: 'ECON101', instructor: 'Prof. Moore', credits: 3 }
    ];

    // First Names
    const firstNames = [
        'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
        'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
        'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
        'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
        'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
        'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
        'Edward', 'Deborah'
    ];

    // Last Names
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
        'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
        'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
        'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
        'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
        'Carter', 'Roberts'
    ];

    // Generate 50 students
    students = [];
    for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[i - 1];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@university.edu`;
        
        students.push({
            id: i,
            name: `${firstName} ${lastName}`,
            email: email,
            classId: classes[Math.floor(Math.random() * classes.length)].id,
            enrollmentDate: generateRandomDate()
        });
    }

    // Generate grades for students
    grades = [];
    let gradeId = 1;
    students.forEach(student => {
        // Each student has 3-5 grades
        const numGrades = Math.floor(Math.random() * 3) + 3;
        const studentClasses = [...classes].sort(() => Math.random() - 0.5).slice(0, numGrades);
        
        studentClasses.forEach(cls => {
            grades.push({
                id: gradeId++,
                studentId: student.id,
                classId: cls.id,
                grade: Math.floor(Math.random() * 41) + 60, // Grades between 60-100
                date: generateRandomDate()
            });
        });
    });

    saveData();
}

// Generate random date within last year
function generateRandomDate() {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('students', JSON.stringify(students));
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('grades', JSON.stringify(grades));
}

// Load data from localStorage
function loadData() {
    const storedStudents = localStorage.getItem('students');
    const storedClasses = localStorage.getItem('classes');
    const storedGrades = localStorage.getItem('grades');

    if (storedStudents) students = JSON.parse(storedStudents);
    if (storedClasses) classes = JSON.parse(storedClasses);
    if (storedGrades) grades = JSON.parse(storedGrades);
}

// Dashboard Rendering
function renderDashboard() {
    // Calculate stats
    const totalStudents = students.length;
    const totalClasses = classes.length;
    const totalGrades = grades.length;
    const avgGrade = grades.length > 0 
        ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(1)
        : 0;

    // Update stat cards
    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('total-classes').textContent = totalClasses;
    document.getElementById('total-grades').textContent = totalGrades;
    document.getElementById('avg-grade').textContent = avgGrade;

    // Recent students
    const recentStudents = [...students].sort((a, b) => 
        new Date(b.enrollmentDate) - new Date(a.enrollmentDate)
    ).slice(0, 5);

    const recentStudentsHtml = recentStudents.map(student => {
        const className = classes.find(c => c.id === student.classId)?.name || 'N/A';
        return `
            <div class="list-item">
                <div class="list-item-avatar">${student.name.charAt(0)}</div>
                <div class="list-item-info">
                    <h4>${student.name}</h4>
                    <p>${className}</p>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('recent-students').innerHTML = recentStudentsHtml;

    // Class distribution
    const classDistribution = {};
    students.forEach(student => {
        const className = classes.find(c => c.id === student.classId)?.name || 'Unknown';
        classDistribution[className] = (classDistribution[className] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(classDistribution));
    const distributionHtml = Object.entries(classDistribution).map(([className, count]) => `
        <div class="chart-bar">
            <div class="chart-bar-label">${className}</div>
            <div class="chart-bar-fill">
                <div class="chart-bar-progress" style="width: ${(count / maxCount) * 100}%">
                    ${count}
                </div>
            </div>
        </div>
    `).join('');
    document.getElementById('class-distribution').innerHTML = distributionHtml;

    // Top performers
    const studentGPAs = students.map(student => {
        const studentGrades = grades.filter(g => g.studentId === student.id);
        const gpa = studentGrades.length > 0
            ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length)
            : 0;
        return { ...student, gpa };
    }).sort((a, b) => b.gpa - a.gpa).slice(0, 5);

    const topPerformersHtml = studentGPAs.map((student, index) => {
        const className = classes.find(c => c.id === student.classId)?.name || 'N/A';
        return `
            <div class="performer-item">
                <div class="performer-rank">${index + 1}</div>
                <div class="performer-info">
                    <h4>${student.name}</h4>
                    <p>${className}</p>
                </div>
                <div class="performer-gpa">${student.gpa.toFixed(1)}</div>
            </div>
        `;
    }).join('');
    document.getElementById('top-performers').innerHTML = topPerformersHtml;
}

// Students Rendering
function renderStudents(filteredStudents = null) {
    const studentsToRender = filteredStudents || students;
    
    const studentsHtml = studentsToRender.map(student => {
        const className = classes.find(c => c.id === student.classId)?.name || 'N/A';
        const studentGrades = grades.filter(g => g.studentId === student.id);
        const gpa = studentGrades.length > 0
            ? (studentGrades.reduce((sum, g) => sum + g.grade, 0) / studentGrades.length).toFixed(1)
            : 'N/A';

        return `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${className}</td>
                <td>${gpa}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-edit" onclick="editStudent(${student.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('students-table').innerHTML = studentsHtml;
}

// Classes Rendering
function renderClasses() {
    const classesHtml = classes.map(cls => {
        const studentCount = students.filter(s => s.classId === cls.id).length;
        const classGrades = grades.filter(g => g.classId === cls.id);
        const avgGrade = classGrades.length > 0
            ? (classGrades.reduce((sum, g) => sum + g.grade, 0) / classGrades.length).toFixed(1)
            : 'N/A';

        return `
            <div class="class-card">
                <div class="class-card-header">
                    <div class="class-icon">🎓</div>
                    <div class="class-actions">
                        <button class="btn btn-edit" onclick="editClass(${cls.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteClass(${cls.id})">Delete</button>
                    </div>
                </div>
                <h4>${cls.name}</h4>
                <p>${cls.code} • ${cls.instructor}</p>
                <div class="class-stats">
                    <div class="class-stat">
                        <h5>${studentCount}</h5>
                        <p>Students</p>
                    </div>
                    <div class="class-stat">
                        <h5>${cls.credits}</h5>
                        <p>Credits</p>
                    </div>
                    <div class="class-stat">
                        <h5>${avgGrade}</h5>
                        <p>Avg Grade</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('classes-grid').innerHTML = classesHtml;
}

// Grades Rendering
function renderGrades() {
    const gradesHtml = grades.map(grade => {
        const student = students.find(s => s.id === grade.studentId);
        const cls = classes.find(c => c.id === grade.classId);

        return `
            <tr>
                <td>${student ? student.name : 'Unknown'}</td>
                <td>${cls ? cls.name : 'Unknown'}</td>
                <td>${grade.grade}</td>
                <td>${grade.date}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-edit" onclick="editGrade(${grade.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteGrade(${grade.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    document.getElementById('grades-table').innerHTML = gradesHtml;
}

// Search Students
function searchStudents(query) {
    if (!query) {
        renderStudents();
        return;
    }

    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase()) ||
        student.email.toLowerCase().includes(query.toLowerCase())
    );

    renderStudents(filtered);
}

// Modal Functions
function openAddStudentModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Add Student';
    
    const classOptions = classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    document.getElementById('modal-body').innerHTML = `
        <form id="student-form">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="student-name" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="student-email" required>
            </div>
            <div class="form-group">
                <label>Class</label>
                <select id="student-class" required>
                    ${classOptions}
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Student</button>
            </div>
        </form>
    `;

    document.getElementById('student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newStudent = {
            id: students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1,
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            classId: parseInt(document.getElementById('student-class').value),
            enrollmentDate: new Date().toISOString().split('T')[0]
        };
        students.push(newStudent);
        saveData();
        closeModal();
        renderStudents();
        renderDashboard();
    });

    modal.classList.add('active');
}

function openAddClassModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Add Class';
    
    document.getElementById('modal-body').innerHTML = `
        <form id="class-form">
            <div class="form-group">
                <label>Class Name</label>
                <input type="text" id="class-name" required>
            </div>
            <div class="form-group">
                <label>Class Code</label>
                <input type="text" id="class-code" required>
            </div>
            <div class="form-group">
                <label>Instructor</label>
                <input type="text" id="class-instructor" required>
            </div>
            <div class="form-group">
                <label>Credits</label>
                <input type="number" id="class-credits" min="1" max="6" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Class</button>
            </div>
        </form>
    `;

    document.getElementById('class-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newClass = {
            id: classes.length > 0 ? Math.max(...classes.map(c => c.id)) + 1 : 1,
            name: document.getElementById('class-name').value,
            code: document.getElementById('class-code').value,
            instructor: document.getElementById('class-instructor').value,
            credits: parseInt(document.getElementById('class-credits').value)
        };
        classes.push(newClass);
        saveData();
        closeModal();
        renderClasses();
        renderDashboard();
    });

    modal.classList.add('active');
}

function openAddGradeModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = 'Add Grade';
    
    const studentOptions = students.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    const classOptions = classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    document.getElementById('modal-body').innerHTML = `
        <form id="grade-form">
            <div class="form-group">
                <label>Student</label>
                <select id="grade-student" required>
                    ${studentOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Class</label>
                <select id="grade-class" required>
                    ${classOptions}
                </select>
            </div>
            <div class="form-group">
                <label>Grade</label>
                <input type="number" id="grade-value" min="0" max="100" required>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="grade-date" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Add Grade</button>
            </div>
        </form>
    `;

    document.getElementById('grade-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newGrade = {
            id: grades.length > 0 ? Math.max(...grades.map(g => g.id)) + 1 : 1,
            studentId: parseInt(document.getElementById('grade-student').value),
            classId: parseInt(document.getElementById('grade-class').value),
            grade: parseInt(document.getElementById('grade-value').value),
            date: document.getElementById('grade-date').value
        };
        grades.push(newGrade);
        saveData();
        closeModal();
        renderGrades();
        renderDashboard();
    });

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Delete Functions
function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.id !== id);
        grades = grades.filter(g => g.studentId !== id);
        saveData();
        renderStudents();
        renderDashboard();
    }
}

function deleteClass(id) {
    if (confirm('Are you sure you want to delete this class?')) {
        classes = classes.filter(c => c.id !== id);
        grades = grades.filter(g => g.classId !== id);
        saveData();
        renderClasses();
        renderDashboard();
    }
}

function deleteGrade(id) {
    if (confirm('Are you sure you want to delete this grade?')) {
        grades = grades.filter(g => g.id !== id);
        saveData();
        renderGrades();
        renderDashboard();
    }
}

// Edit Functions (simplified - using prompts)
function editStudent(id) {
    const student = students.find(s => s.id === id);
    const newName = prompt('Enter new name:', student.name);
    if (newName) {
        student.name = newName;
        saveData();
        renderStudents();
        renderDashboard();
    }
}

function editClass(id) {
    const cls = classes.find(c => c.id === id);
    const newName = prompt('Enter new class name:', cls.name);
    if (newName) {
        cls.name = newName;
        saveData();
        renderClasses();
        renderDashboard();
    }
}

function editGrade(id) {
    const grade = grades.find(g => g.id === id);
    const newGrade = prompt('Enter new grade (0-100):', grade.grade);
    if (newGrade && !isNaN(newGrade)) {
        grade.grade = parseInt(newGrade);
        saveData();
        renderGrades();
        renderDashboard();
    }
}
