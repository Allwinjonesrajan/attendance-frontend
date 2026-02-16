import React, { useState, useEffect, useCallback } from "react";
import { CONFIG } from "../config/regConfig";
import { StaffAttendanceRegister } from "../constants/registers/staffs/staffAttendance";
import { TraineeAttendanceRegister } from "../constants/registers/staffs/trainee";
import { TelecallingRegister } from "../constants/registers/staffs/telecalling";
import { StationaryRegister } from "../constants/registers/staffs/stationary";
import { FeesRegister } from "../constants/registers/students/fees";
import { EnquiryRegister } from "../constants/registers/staffs/enquiry";
import { HardwareRegister } from "../constants/registers/staffs/hardware";
import { CertificateIssue } from "../constants/registers/students/certificateissue";
import { InfrastructureRegister } from "../constants/registers/staffs/infrastructure";
import { FacultyInvolvementRegister } from "../constants/registers/staffs/facultyinvolve";
import { SeminarRegister } from "../constants/registers/staffs/seminar";
import { StaffTimetableRegister } from "../constants/registers/staffs/timetable";
import { HallTicketIssueRegister } from "../constants/registers/students/hallticket";
import { StaffSelectionTelecalling } from "../constants/registers/hr/StaffSelectionTelecalling";

const Dashboard = ({ user, onLogout }) => {
  const [selectedBranch, setSelectedBranch] = useState(
    user.role === "branch"
      ? user.name
      : user.role === "hr"
        ? "HEAD OFFICE"
        : "",
  );


  const [view, setView] = useState("STAFF");

  const [selectedReg, setSelectedReg] = useState(
    user.role === "hr" ? "STAFF SELECTION TELECALLING" : CONFIG.STAFF_REGS[0],
  );

  const [rows, setRows] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const loadData = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/load/${selectedBranch}/${selectedReg}/${month}`,
      );
      const data = await res.json();
      setRows(data.length > 0 ? data : [{ id: Date.now() }]);
    } catch (err) {
      console.error("Loading failed");
    }
  }, [selectedBranch, selectedReg, month]);

  useEffect(() => {
    if (selectedBranch) loadData();
  }, [selectedBranch, loadData]);

  const saveData = async () => {
    try {
      await fetch("http://localhost:5000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branch: selectedBranch,
          type: selectedReg,
          month,
          data: rows,
        }),
      });
      alert("Data Saved Successfully!");
    } catch (err) {
      alert("Error saving data");
    }
  };

  if (user.role === "admin" && !selectedBranch) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          background: "#e6fffa",
          minHeight: "100vh",
        }}
      >
        <h1 style={{ color: "#0f766e" }}>Master Admin Dashboard</h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {CONFIG.BRANCHES.map((b) => (
            <div
              key={b}
              onClick={() => setSelectedBranch(b)}
              style={{
                background: "#fff",
                padding: "35px",
                borderRadius: "20px",
                cursor: "pointer",
                boxShadow: "0 8px 15px rgba(0,0,0,0.05)",
                border: "1px solid #b2f5ea",
                width: "200px",
              }}
            >
              <b style={{ color: "#0f766e", fontSize: "1.2rem" }}>{b}</b>
            </div>
          ))}
        </div>
        <button
          onClick={onLogout}
          style={{
            marginTop: "50px",
            padding: "10px 30px",
            borderRadius: "10px",
            border: "none",
            background: "#e53e3e",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0fdf4" }}>
      <header
        style={{
          background: "#fff",
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div
          style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#0f766e" }}
        >
          {user.role === "hr" ? "HR Department" : `${selectedBranch} Office`}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #cbd5e0",
            }}
          />
          <button
            onClick={
              user.role === "admin" ? () => setSelectedBranch("") : onLogout
            }
            style={{
              padding: "8px 15px",
              borderRadius: "8px",
              border: "none",
              background: "#319795",
              color: "white",
              cursor: "pointer",
            }}
          >
            {user.role === "admin" ? "Back" : "Logout"}
          </button>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          padding: "20px",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        <aside
          style={{
            width: "100%",
            maxWidth: "280px",
            background: "#fff",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
          }}
        >

          {user.role !== "hr" && (
            <div
              style={{
                display: "flex",
                marginBottom: "20px",
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #b2f5ea",
              }}
            >
              <button
                onClick={() => setView("STAFF")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  background: view === "STAFF" ? "#319795" : "white",
                  color: view === "STAFF" ? "white" : "#319795",
                  cursor: "pointer",
                }}
              >
                {" "}
                STAFF{" "}
              </button>
              <button
                onClick={() => setView("STUDENT")}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  background: view === "STUDENT" ? "#319795" : "white",
                  color: view === "STUDENT" ? "white" : "#319795",
                  cursor: "pointer",
                }}
              >
                {" "}
                STUDENT{" "}
              </button>
            </div>
          )}

          <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
            {user.role === "hr" ? (
              <div
                onClick={() => setSelectedReg("STAFF SELECTION TELECALLING")}
                style={{
                  padding: "12px",
                  cursor: "pointer",
                  borderRadius: "10px",
                  background: "#e6fffa",
                  color: "#2c7a7b",
                  fontWeight: "bold",
                }}
              >
                STAFF SELECTION TELECALLING
              </div>
            ) : (
              (view === "STAFF" ? CONFIG.STAFF_REGS : CONFIG.STUDENT_REGS).map(
                (r) => (
                  <div
                    key={r}
                    onClick={() => setSelectedReg(r)}
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      borderRadius: "10px",
                      marginBottom: "5px",
                      fontSize: "14px",
                      background: selectedReg === r ? "#e6fffa" : "transparent",
                      color: selectedReg === r ? "#2c7a7b" : "#4a5568",
                      fontWeight: selectedReg === r ? "bold" : "normal",
                    }}
                  >
                    {r}
                  </div>
                ),
              )
            )}
          </div>
        </aside>

        <main
          style={{
            flex: 1,
            minWidth: "320px",
            background: "#fff",
            borderRadius: "15px",
            padding: "25px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <h2 style={{ color: "#0f766e", margin: 0 }}>{selectedReg}</h2>
              <p
                style={{
                  color: "#718096",
                  fontSize: "14px",
                  margin: "5px 0 0 0",
                }}
              >
                Register for {month}
              </p>
            </div>
            <button
              onClick={saveData}
              style={{
                background: "#10b981",
                color: "#fff",
                padding: "12px 30px",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
              }}
            >
              SAVE CHANGES
            </button>
          </div>

          {selectedReg === "STAFF SELECTION TELECALLING" ? (
            <StaffSelectionTelecalling
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg.replace(/\s/g, "").toUpperCase() ===
            "STAFFATTENDANCE" ? (
            <StaffAttendanceRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
              selectedReg={selectedReg}
            />
          ) : selectedReg.replace(/\s/g, "").toUpperCase() === "TRAINY" ? (
            <TraineeAttendanceRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
              selectedReg={selectedReg}
            />
          ) : selectedReg.replace(/\s/g, "").toUpperCase() === "TELECALLING" ? (
            <TelecallingRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "STATIONARY" ? (
            <StationaryRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "FEES" ? (
            <FeesRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "ENQUIRY" ? (
            <EnquiryRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "HARDWARE" ? (
            <HardwareRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "CERTIFICATE ISSUE" ? (
            <CertificateIssue
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "INFRASTRUCTURE" ? (
            <InfrastructureRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "FACULTY INVOLVE" ? (
            <FacultyInvolvementRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "SEMINAR" ? (
            <SeminarRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "STAFF TIMETABLE" ? (
            <StaffTimetableRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : selectedReg === "HALLTICKET" ? (
            <HallTicketIssueRegister
              rows={rows}
              setRows={setRows}
              month={month}
              branch={selectedBranch}
            />
          ) : (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#718096" }}
            >
              Register UI for "{selectedReg}" is under development.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
