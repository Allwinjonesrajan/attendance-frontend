import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"];

export const getStaffTimetableCols = () => {
  let cols = ["S.No", "Staff Name", "Designation"];
  DAYS.forEach((day) => {
    PERIODS.forEach((p) => {
      cols.push(`${day} - ${p}`);
    });
  });
  return cols;
};

export const StaffTimetableRegister = ({
  rows,
  setRows,
  branch
}) => {

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => {
      const obj = {
        "S.No": index + 1,
        "Staff Name": row["Staff Name"] || "-",
        "Designation": row["Designation"] || "-",
      };

      DAYS.forEach((day) => {
        PERIODS.forEach((p) => {
          const colName = `${day} - ${p}`;
          obj[colName] = row[colName] || "-";
        });
      });

      return obj;
    });

    downloadExcelFile(dataToExport, "Staff_Timetable", branch, "Academic_Year_2026");
  };

  const currentCols = getStaffTimetableCols();

  const onAddRow = () => setRows([...rows, { id: Date.now() }]);

  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
    else alert("At least one row is required.");
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
          maxHeight: "75vh",
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
              background: "#f8fafc",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "6px",
                  border: "1px solid #e2e8f0",
                  color: "#334155",
                  width: "40px",
                  position: "sticky",
                  left: 0,
                  background: "#f8fafc",
                  zIndex: 110,
                }}
              >
                ×
              </th>
              {currentCols.map((col) => {
                const isSticky = col === "S.No" || col === "Staff Name" || col === "Designation";
                let leftPos = 0;
                if (col === "S.No") leftPos = 40;
                if (col === "Staff Name") leftPos = 80;
                if (col === "Designation") leftPos = 300;

                return (
                  <th
                    key={col}
                    style={{
                      padding: "10px 6px",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                      minWidth:
                        col === "S.No" ? "40px" : 
                        col === "Staff Name" ? "220px" : 
                        col === "Designation" ? "180px" : "100px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#f8fafc",
                      zIndex: isSticky ? 110 : 1,
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
                    zIndex: 10,
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
                    }}
                  >
                    ×
                  </button>
                </td>
                {currentCols.map((col) => {
                  const isSNo = col === "S.No";
                  const isSticky = isSNo || col === "Staff Name" || col === "Designation";
                  
                  let leftPos = 0;
                  if (col === "S.No") leftPos = 40;
                  if (col === "Staff Name") leftPos = 80;
                  if (col === "Designation") leftPos = 300;

                  return (
                    <td
                      key={col}
                      style={{
                        border: "1px solid #e2e8f0",
                        padding: 0,
                        position: isSticky ? "sticky" : "static",
                        left: isSticky ? leftPos : "auto",
                        background: isSticky ? "#fff" : "transparent",
                        zIndex: isSticky ? 10 : 1,
                      }}
                    >
                      <input
                        value={isSNo ? index + 1 : row[col] || ""}
                        readOnly={isSNo}
                        onChange={(e) => onCellChange(row.id, col, e.target.value)}
                        placeholder={!isSticky ? "Class/Sub" : ""}
                        style={{
                          width: "100%",
                          padding: "10px 8px",
                          border: "none",
                          outline: "none",
                          textAlign: isSNo ? "center" : "left",
                          backgroundColor: isSNo ? "#f1f5f9" : "transparent",
                          fontWeight: isSticky ? "bold" : "normal",
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

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 25px",
            background: "#475569",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Staff Member
        </button>

        <button
          onClick={handleDownload}
          style={{
            marginLeft: "10px",
            padding: "12px 25px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📥 Download Timetable
        </button>
      </div>
    </>
  );
};