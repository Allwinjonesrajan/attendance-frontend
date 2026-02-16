import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const getFacultyInvolveCols = () => {
  return [
    "S.No",
    "Faculty Name",
    "Designation",
    "Department",
    "Activity Type",
    "Role",
    "Topic/Title",
    "Date of Event",
    "Duration",
    "Outcome/Achievement",
    "Points/Score"
  ];
};

export const FacultyInvolvementRegister = ({
  rows,
  setRows,
  month,
  branch
}) => {
  
  const currentCols = getFacultyInvolveCols();

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => {
      const obj = {};
      currentCols.forEach((col) => {
        if (col === "S.No") {
          obj[col] = index + 1;
        } else {
          obj[col] = row[col] || "-";
        }
      });
      return obj;
    });

    downloadExcelFile(dataToExport, "Faculty_Involvement_Register", branch, month);
  };

  const onAddRow = () => setRows([...rows, { id: Date.now() }]);
  
  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
    else alert("At least one entry is required.");
  };

  const onCellChange = (id, col, val) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          background: "#fff",
          maxHeight: "70vh",
        }}
      >
        <table
          border="1"
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontSize: "13px",
          }}
        >
          <thead
            style={{
              background: "#eff6ff",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "6px",
                  border: "1px solid #e2e8f0",
                  color: "#1e40af",
                  width: "40px",
                  position: "sticky",
                  left: 0,
                  background: "#eff6ff",
                  zIndex: 11,
                }}
              >
                ×
              </th>
              {currentCols.map((col) => {
                const isSticky =
                  col === "S.No" ||
                  col === "Faculty Name" ||
                  col === "Designation";
                
                let leftPos =
                  col === "S.No"
                    ? 40
                    : col === "Faculty Name"
                      ? 80
                      : col === "Designation"
                        ? 280
                        : 0;

                return (
                  <th
                    key={col}
                    style={{
                      padding: "12px 8px",
                      border: "1px solid #e2e8f0",
                      color: "#1e40af",
                      minWidth:
                        col === "S.No" ? "40px" : 
                        col === "Faculty Name" ? "200px" : 
                        col === "Designation" ? "150px" : 
                        col === "Topic/Title" ? "250px" : "140px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#eff6ff",
                      zIndex: isSticky ? 11 : 1,
                    }}
                  >
                    {col}
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
                    border: "1px solid #e2e8f0",
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    zIndex: 5,
                  }}
                >
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    ×
                  </button>
                </td>
                {currentCols.map((col) => {
                  const isSNo = col === "S.No";
                  const isSticky = isSNo || col === "Faculty Name" || col === "Designation";
                  
                  let leftPos = isSNo
                    ? 40
                    : col === "Faculty Name"
                      ? 80
                      : col === "Designation"
                        ? 280
                        : 0;

                  return (
                    <td
                      key={col}
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: 0,
                        position: isSticky ? "sticky" : "static",
                        left: isSticky ? leftPos : "auto",
                        background: isSticky ? "#fff" : "transparent",
                        zIndex: isSticky ? 5 : 1,
                      }}
                    >
                      <input
                        value={isSNo ? index + 1 : row[col] || ""}
                        readOnly={isSNo}
                        onChange={(e) => {
                          if (!isSNo) onCellChange(row.id, col, e.target.value);
                        }}
                        placeholder={isSNo ? "" : `...`}
                        style={{
                          width: "100%",
                          padding: "10px 8px",
                          border: "none",
                          outline: "none",
                          textAlign: isSNo ? "center" : "left",
                          backgroundColor: isSNo ? "#f8fafc" : "transparent",
                          color: "#334155",
                        }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 28px",
            background: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          + Add Faculty Record
        </button>
        
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 28px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          📥 Download Involvement Sheet
        </button>
      </div>
    </>
  );
};