import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const TelecallingRegister = ({ rows, setRows, month, branch }) => {
  const onAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        candidateName: "",
        mobileNumber: "",
        location: "",
        passoutYear: "",
        interest: "Interested",
        comment1: "",
      },
    ]);
  };

  const onRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    } else {
      alert("At least one row is required.");
    }
  };

  const onCellChange = (id, col, val) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      Date: row.date || "-",
      "Candidate Name": row.candidateName || "-",
      "Mobile Number": row.mobileNumber || "-",
      Location: row.location || "-",
      "Passout Year": row.passoutYear || "-",
      "Salary Expectation": row.salaryExpectation || "-",
      Interest: row.interest || "-",
      "Comment 1": row.comment1 || "-",
      "Comment 2": row.comment2 || "-",
    }));

    downloadExcelFile(dataToExport, "Telecalling_Register", branch, month);
  };

  const columns = [
    { label: "Date", key: "date", width: "150px" },
    { label: "Candidate Name", key: "candidateName", width: "200px" },
    { label: "Mobile Number", key: "mobileNumber", width: "150px" },
    { label: "Location", key: "location", width: "150px" },
    { label: "Passout Year", key: "passoutYear", width: "110px" },
    { label: "Interest", key: "interest", width: "150px" },
    { label: "Comment 1", key: "comment1", width: "200px" },
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
            borderCollapse: "collapse",
            tableLayout: "fixed",
            fontSize: "13px",
          }}
        >
          <thead
            style={{
              background: "#f0fdf4",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th
                style={{
                  width: "60px",
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  color: "#0f766e",
                }}
              >
                Del
              </th>
              <th
                style={{
                  width: "50px",
                  padding: "12px",
                  border: "1px solid #e2e8f0",
                  color: "#0f766e",
                }}
              >
                S.No
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    padding: "12px 8px",
                    border: "1px solid #e2e8f0",
                    color: "#0f766e",
                    textAlign: "center",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} style={{ transition: "background 0.2s" }}>
                <td
                  style={{
                    textAlign: "center",
                    border: "1px solid #e2e8f0",
                    background: "#fff",
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
                      lineHeight: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </td>

                <td
                  style={{
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                    background: "#f8fafc",
                    color: "#64748b",
                  }}
                >
                  {index + 1}
                </td>

                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ border: "1px solid #e2e8f0", padding: 0 }}
                  >
                    {col.key === "interest" ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                          fontWeight: "500",
                          color: "#0f766e",
                        }}
                      >
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Call Back">Call Back</option>
                        <option value="Joined">Joined</option>
                      </select>
                    ) : (
                      <input
                        type={col.key === "date" ? "date" : "text"}
                        placeholder={`Enter ${col.label}`}
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={inputStyle}
                      />
                    )}
                  </td>
                ))}
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 6px -1px rgba(15, 118, 110, 0.2)",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>+</span> Add New Candidate
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
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)",
          }}
        >
          📥 Download Excel
        </button>
      </div>
    </div>
  );
};
