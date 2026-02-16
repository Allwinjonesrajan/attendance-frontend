import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const getSeminarCols = () => {
  return [
    "S.No",
    "Seminar/Webinar Title",
    "Date",
    "Type",
    "Resource Person Name",
    "Organization/Affiliation",
    "Total Participants",
    "Internal Students",
    "External Delegates",
    "Venue/Link",
    "Budget Utilized",
    "Coordinator Name"
  ];
};

export const SeminarRegister = ({
  rows,
  setRows,
  month,
  branch
}) => {
  
  const currentCols = getSeminarCols();

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

    downloadExcelFile(dataToExport, "Seminar_Activity_Register", branch, month);
  };

  const onAddRow = () => setRows([...rows, { id: Date.now() }]);
  
  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
    else alert("Minimum one record entry required.");
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
          borderRadius: "12px",
          background: "#fff",
          maxHeight: "70vh",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
              background: "#fdf2f8",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  color: "#be185d",
                  width: "40px",
                  position: "sticky",
                  left: 0,
                  background: "#fdf2f8",
                  zIndex: 11,
                }}
              >
                ×
              </th>
              {currentCols.map((col) => {
                const isSticky =
                  col === "S.No" ||
                  col === "Seminar/Webinar Title" ||
                  col === "Date";
                
                let leftPos =
                  col === "S.No"
                    ? 40
                    : col === "Seminar/Webinar Title"
                      ? 80
                      : col === "Date"
                        ? 330
                        : 0;

                return (
                  <th
                    key={col}
                    style={{
                      padding: "12px 10px",
                      border: "1px solid #e2e8f0",
                      color: "#9d174d",
                      minWidth:
                        col === "S.No" ? "40px" : 
                        col === "Seminar/Webinar Title" ? "250px" : 
                        col === "Resource Person Name" ? "200px" : 
                        col === "Date" ? "120px" : "150px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#fdf2f8",
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
                      color: "#db2777",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    ×
                  </button>
                </td>
                {currentCols.map((col) => {
                  const isSNo = col === "S.No";
                  const isSticky = isSNo || col === "Seminar/Webinar Title" || col === "Date";
                  
                  let leftPos = isSNo
                    ? 40
                    : col === "Seminar/Webinar Title"
                      ? 80
                      : col === "Date"
                        ? 330
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
                        placeholder={isSNo ? "" : "..."}
                        style={{
                          width: "100%",
                          padding: "12px 10px",
                          border: "none",
                          outline: "none",
                          textAlign: isSNo ? "center" : "left",
                          backgroundColor: isSNo ? "#fff1f2" : "transparent",
                          color: "#1e293b",
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

      <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 30px",
            background: "#be185d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            transition: "background 0.2s"
          }}
        >
          + Add New Event
        </button>
        
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 30px",
            background: "#7c3aed",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          📥 Download Event Report
        </button>
      </div>
    </>
  );
};