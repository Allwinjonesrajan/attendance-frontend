import React, { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

const inputStyle = {
  width: "90%",
  padding: "10px",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  fontSize: "13px",
  outline: "none",
  background: "#fcfcfc",
};

export const CertificateIssue = ({ rows, setRows, month, branch }) => {
  const isLoaded = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  const storageKey = `cert_v2_${branch}_${month}`;
  const savedData = localStorage.getItem(storageKey);
  if (savedData && savedData !== "[]") {
    setRows(JSON.parse(savedData));
  } else {
    setRows([createNewRow([])]);
  }
  setTimeout(() => {
    isLoaded.current = true;
  }, 500);
}, [branch, month, setRows]);


  useEffect(() => {
    if (isLoaded.current) {
      const storageKey = `cert_v2_${branch}_${month}`;
      localStorage.setItem(storageKey, JSON.stringify(rows));
    }
  }, [rows, branch, month]);

  const createNewRow = (currentRows = []) => {
    let nextNumber = 1;
    if (currentRows.length > 0) {
      const lastId = Math.max(...currentRows.map(r => {
        const num = parseInt(r.certificateId);
        return isNaN(num) ? 0 : num;
      }));
      nextNumber = lastId + 1;
    }

    return {
      id: Date.now() + Math.random(),
      date: new Date().toISOString().split("T")[0],
      studentName: "",
      courseName: "",
      certificateId: nextNumber.toString(),
      grade: "A",
      status: "Pending",
    };
  };

  const generateProfessionalCertificate = (row) => {
    if (!row.studentName || !row.courseName) {
      alert("Please fill Student Name and Course first!");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const logoUrl = "/assets/logo.png";

    const generatePDF = (logoBase64) => {
      doc.setDrawColor(15, 118, 110);
      doc.setLineWidth(2);
      doc.rect(5, 5, width - 10, height - 10);
      doc.setLineWidth(0.5);
      doc.rect(7, 7, width - 14, height - 14);

      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", width - 45, 15, 25, 25);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(15, 118, 110);
      doc.text(
        branch
          ? `Attendance INSTITUTE - ${branch.toUpperCase()}`
          : "Attendance INSTITUTE",
        width / 2,
        25,
        { align: "center" },
      );

      doc.setFont("times", "bold");
      doc.setFontSize(38);
      doc.setTextColor(0, 0, 0);
      doc.text("CERTIFICATE OF COMPLETION", width / 2, 55, {
        align: "center",
      });

      doc.setFont("helvetica", "italic");
      doc.setFontSize(16);
      doc.setTextColor(80);
      doc.text("This document is proudly presented to", width / 2, 75, {
        align: "center",
      });

      doc.setFont("times", "bolditalic");
      doc.setFontSize(32);
      doc.setTextColor(15, 118, 110);
      doc.text((row.studentName ?? "").toUpperCase(), width / 2, 95, {
        align: "center",
      });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(15);
      doc.setTextColor(80);
      const achievementText = `In recognition of the successful completion and professional attainment in`;
      doc.text(achievementText, width / 2, 115, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(row.courseName, width / 2, 130, { align: "center" });

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      const footerPara =
        "This candidate has demonstrated exceptional proficiency and met all the requirements set forth by the board of examiners.";
      doc.text(footerPara, width / 2, 145, { align: "center", maxWidth: 180 });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`DATE OF ISSUE: ${row.date}`, 30, 175);
      doc.text(`CERTIFICATE ID: ${row.certificateId}`, 30, 182);
      doc.text(`GRADE ATTAINED: ${row.grade}`, 30, 189);

      doc.line(width - 80, 180, width - 30, 180);
      doc.setFontSize(12);
      doc.text("HEAD OF INSTITUTION", width - 55, 187, { align: "center" });

      doc.save(`${row.studentName}_Professional_Certificate.pdf`);
      onCellChange(row.id, "status", "Issued");
    };

    const img = new Image();
    img.src = logoUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      generatePDF(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      console.warn("Logo not found, generating without logo.");
      generatePDF(null);
    };
  };

  const onAddRow = () => {
    setRows([...rows, createNewRow(rows)]);
  };

  const onRemoveRow = (id) =>
    rows.length > 1 && setRows(rows.filter((r) => r.id !== id));

  const onCellChange = (id, col, val) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [col]: val } : r)),
    );
  };

  const handleExcelExport = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      Date: row.date,
      "Student Name": row.studentName,
      Course: row.courseName,
      "Cert ID": row.certificateId,
      Grade: row.grade,
      Status: row.status,
    }));
    downloadExcelFile(dataToExport, "Certificate_Register", branch, month);
  };

  const filteredRows = rows.filter(
    (r) =>
      (r.studentName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.certificateId ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div style={{ padding: "20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="🔍 Search Student or Cert ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            width: "350px",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      <div
        style={{
          overflowX: "auto",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          borderRadius: "12px",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            minWidth: "950px",
          }}
        >
          <thead>
            <tr style={{ background: "#0f766e", color: "white" }}>
              <th style={{ padding: "15px", width: "50px" }}>Del</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Issue Date</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Student Name</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Course Name</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Certificate ID</th>
              <th style={{ padding: "15px", textAlign: "left" }}>Grade</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Status</th>
              <th style={{ padding: "15px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    ×
                  </button>
                </td>
                <td>
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) => onCellChange(row.id, "date", e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td>
                  <input
                    placeholder="Enter Full Name"
                    value={row.studentName}
                    onChange={(e) => onCellChange(row.id, "studentName", e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td>
                  <input
                    placeholder="Course Name"
                    value={row.courseName}
                    onChange={(e) => onCellChange(row.id, "courseName", e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td>
                  <input
                    value={row.certificateId}
                    onChange={(e) => onCellChange(row.id, "certificateId", e.target.value)}
                    style={inputStyle}
                  />
                </td>
                <td>
                  <select
                    value={row.grade}
                    onChange={(e) => onCellChange(row.id, "grade", e.target.value)}
                    style={inputStyle}
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "800",
                      background: row.status === "Issued" ? "#dcfce7" : "#fef9c3",
                      color: row.status === "Issued" ? "#166534" : "#854d0e",
                      textTransform: "uppercase",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => generateProfessionalCertificate(row)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      padding: "8px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "12px",
                    }}
                  >
                    PRINT PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 28px",
            background: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(15, 118, 110, 0.2)",
          }}
        >
          + ADD NEW STUDENT
        </button>
        <button
          onClick={handleExcelExport}
          style={{
            padding: "12px 28px",
            background: "#64748b",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          📥 EXPORT EXCEL LOG
        </button>
      </div>
    </div>
  );
};