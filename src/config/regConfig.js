const generateAttendanceCols = (nameType = "Staff Name", detailType = "Designation") => {
    let cols = ["S.No", nameType, detailType]; 
    for (let i = 1; i <= 31; i++) {
        cols.push(`${i} In`);
        cols.push(`${i} Out`);
    }
    return cols;
};

export const CONFIG = {
    HR_AUTH: { email: "hr@gmail.com", pass: "hr123" },
    BRANCH_AUTH: {
        "Tirunelveli": { email: "tvl@gmail.com", pass: "tvl123" },
        "Chennai": { email: "chennai@gmail.com", pass: "chn123" },
        "Trivandrum": { email: "tvm@gmail.com", pass: "tvm123" },
        "Covai": { email: "covai@gmail.com", pass: "cbe123" },
        "Madurai": { email: "madurai@gmail.com", pass: "mdu123" }
    },
    BRANCHES: ["Tirunelveli", "Chennai", "Trivandrum", "Covai", "Madurai"],

    HR_REGS: ["STAFF SELECTION TELECALLING"],
    STAFF_REGS: [
        "STAFF ATTENDANCE", "TRAINY", "ENQUIRY", "TELECALLING", "STATIONARY",
        "HARDWARE", "INFRASTRUCTURE", "FACULTY INVOLVE", "SEMINAR", "STAFF TIMETABLE"
    ],
    STUDENT_REGS: ["FEES", "CERTIFICATE ISSUE", "HALLTICKET"],
    COLUMNS: {
        "STAFF ATTENDANCE": generateAttendanceCols("Staff Name", "Designation"),
        "TRAINY": generateAttendanceCols("Trainee Name", "Department"),
        "FEES": ["S.No", "Student Name", "Course", "Paid", "Balance"],
        "TELECALLING": ["S.No", "Date", "Phone", "Status", "Remarks"],
        "STATIONARY": ["S.No", "Item", "Qty", "Purpose"],
        "ENQUIRY": ["S.No", "Name", "Phone", "Course", "Status"],
        "STAFF SELECTION TELECALLING": [
            "S.No", "Date", "Candidate Name", "Position Applied", 
            "Experience", "Current Salary", "Expected Salary", "Status"
        ]
    }
};
