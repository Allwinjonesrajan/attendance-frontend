import React, { useEffect } from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const EnquiryRegister = ({ rows, setRows, month, branch }) => {
  useEffect(() => {
    if (!rows || rows.length === 0) {
      setRows([
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          studentName: "",
          contactNumber: "",
          courseInterested: "",
          source: "Walk-in",
          handledBy: "",
          status: "Follow-up",
          remarks: "",
        },
      ]);
    }
  }, [rows, setRows]);

  const onAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        studentName: "",
        contactNumber: "",
        courseInterested: "",
        source: "Walk-in",
        handledBy: "",
        status: "Follow-up",
        remarks: "",
      },
    ]);
  };

  const onRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    } else {
      alert("At least one entry is required.");
    }
  };

  const onCellChange = (id, col, val) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const sendWhatsApp = (row) => {
    if (!row.contactNumber || !row.studentName) {
      alert("Please enter Name and Contact Number first!");
      return;
    }

    const cleanNumber = row.contactNumber.replace(/\D/g, "");

    const message = `Dear ${row.studentName},

It was great discussing your career goals today! Based on our conversation, the ${row.courseInterested || "selected program"} is the perfect fit to help you reach your milestones.

We are excited to have you onboard. You can now proceed with the enrollment process to secure your slot. Please let us know if you need any assistance with the documentation or fee details.

Looking forward to seeing you in class and helping you build a bright future!

Best Regards,
Attendance TEAM.`;

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      Date: row.date,
      "Student Name": row.studentName || "-",
      Contact: row.contactNumber || "-",
      "Course Interested": row.courseInterested || "-",
      Source: row.source || "-",
      "Counselor/Staff": row.handledBy || "-",
      Status: row.status,
      Remarks: row.remarks || "-",
    }));

    downloadExcelFile(dataToExport, "Enquiry_Register", branch, month);
  };

  const columns = [
    { label: "Date", key: "date", width: "140px" },
    { label: "Student Name", key: "studentName", width: "180px", sticky: true },
    { label: "Contact No", key: "contactNumber", width: "140px" },
    { label: "Course Interested", key: "courseInterested", width: "160px" },
    { label: "Source", key: "source", width: "120px" },
    { label: "Handled By", key: "handledBy", width: "140px" },
    { label: "Status", key: "status", width: "130px" },
    { label: "Remarks", key: "remarks", width: "200px" },
    { label: "Action", key: "action", width: "100px" },
  ];

  const inputStyle = {
    width: "100%",
    height: "100%",
    padding: "10px",
    border: "none",
    outline: "none",
    fontSize: "13px",
    background: "transparent",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "5px" }}>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          background: "#fff",
          maxHeight: "65vh",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <table
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <thead
            style={{
              background: "#f0fdf4",
              position: "sticky",
              top: 0,
              zIndex: 30,
            }}
          >
            <tr>
              <th
                style={{
                  width: "60px",
                  padding: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  borderRight: "1px solid #e2e8f0",
                  color: "#0f766e",
                  position: "sticky",
                  left: 0,
                  background: "#f0fdf4",
                  zIndex: 40,
                }}
              >
                Del
              </th>
              <th
                style={{
                  width: "50px",
                  padding: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  borderRight: "1px solid #e2e8f0",
                  color: "#0f766e",
                  position: "sticky",
                  left: "60px",
                  background: "#f0fdf4",
                  zIndex: 40,
                }}
              >
                S.No
              </th>
              {columns.map((col) => {
                const isName = col.key === "studentName";
                return (
                  <th
                    key={col.key}
                    style={{
                      width: col.width,
                      padding: "12px 8px",
                      borderBottom: "1px solid #e2e8f0",
                      borderRight: "1px solid #e2e8f0",
                      color: "#0f766e",
                      textAlign: "center",
                      position: isName ? "sticky" : "static",
                      left: isName ? "110px" : "auto",
                      background: "#f0fdf4",
                      zIndex: isName ? 40 : 10,
                    }}
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 20,
                  }}
                >
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "#fee2e2",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </td>
                <td
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    borderRight: "1px solid #e2e8f0",
                    textAlign: "center",
                    background: "#f8fafc",
                    color: "#64748b",
                    position: "sticky",
                    left: "60px",
                    zIndex: 20,
                  }}
                >
                  {index + 1}
                </td>
                {columns.map((col) => {
                  const isName = col.key === "studentName";
                  return (
                    <td
                      key={col.key}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        borderRight: "1px solid #e2e8f0",
                        padding: 0,
                        position: isName ? "sticky" : "static",
                        left: isName ? "110px" : "auto",
                        background: isName ? "#fff" : "transparent",
                        zIndex: isName ? 20 : 1,
                      }}
                    >
                      {col.key === "status" ? (
                        <select
                          value={row[col.key]}
                          onChange={(e) =>
                            onCellChange(row.id, col.key, e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            background:
                              row.status === "Joined"
                                ? "#dcfce7"
                                : row.status === "Follow-up"
                                  ? "#fef9c3"
                                  : "#fee2e2",
                            fontWeight: "bold",
                          }}
                        >
                          <option value="Follow-up">Follow-up</option>
                          <option value="Joined">Joined</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Call Back">Call Back</option>
                        </select>
                      ) : col.key === "source" ? (
                        <select
                          value={row[col.key]}
                          onChange={(e) =>
                            onCellChange(row.id, col.key, e.target.value)
                          }
                          style={inputStyle}
                        >
                          <option value="Walk-in">Walk-in</option>
                          <option value="Instagram">Instagram</option>
                          <option value="Facebook">Facebook</option>
                          <option value="Google">Google</option>
                          <option value="Reference">Reference</option>
                        </select>
                      ) : col.key === "action" ? (
                        <div style={{ textAlign: "center", padding: "5px" }}>
                          <button
                            onClick={() => sendWhatsApp(row)}
                            style={{
                              background: "#25d366",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              padding: "5px 10px",
                              cursor: "pointer",
                              fontSize: "11px",
                              fontWeight: "bold",
                            }}
                          >
                            WhatsApp
                          </button>
                        </div>
                      ) : (
                        <input
                          type={col.key === "date" ? "date" : "text"}
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            onCellChange(row.id, col.key, e.target.value)
                          }
                          style={inputStyle}
                          placeholder="..."
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 25px",
            background: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add New Enquiry
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 25px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📥 Download Report
        </button>
      </div>
    </div>
  );
};
