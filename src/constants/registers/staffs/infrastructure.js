import React from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const getInfrastructureCols = () => {
  return [
    "S.No",
    "Asset Name",
    "Asset ID/Serial",
    "Location/Room",
    "Category",
    "Purchase Date",
    "Warranty Expiry",
    "Last Service",
    "Next Service",
    "Status",
    "Remarks"
  ];
};

export const InfrastructureRegister = ({
  rows,
  setRows,
  month,
  branch
}) => {
  
  const currentCols = getInfrastructureCols();

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

    downloadExcelFile(dataToExport, "Infrastructure_Register", branch, month);
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
              background: "#f8fafc",
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
                  color: "#475569",
                  width: "40px",
                  position: "sticky",
                  left: 0,
                  background: "#f8fafc",
                  zIndex: 11,
                }}
              >
                ×
              </th>
              {currentCols.map((col) => {
                const isSticky =
                  col === "S.No" ||
                  col === "Asset Name" ||
                  col === "Asset ID/Serial";
                
                let leftPos =
                  col === "S.No"
                    ? 40
                    : col === "Asset Name"
                      ? 80
                      : col === "Asset ID/Serial"
                        ? 280
                        : 0;

                return (
                  <th
                    key={col}
                    style={{
                      padding: "10px 6px",
                      border: "1px solid #e2e8f0",
                      color: "#334155",
                      minWidth:
                        col === "S.No" ? "40px" : 
                        col === "Asset Name" ? "200px" : 
                        col === "Asset ID/Serial" ? "150px" : 
                        col === "Remarks" ? "250px" : "130px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#f8fafc",
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
                  const isSticky = isSNo || col === "Asset Name" || col === "Asset ID/Serial";
                  
                  let leftPos = isSNo
                    ? 40
                    : col === "Asset Name"
                      ? 80
                      : col === "Asset ID/Serial"
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
                        placeholder={`Enter ${col}...`}
                        style={{
                          width: "100%",
                          padding: "10px 8px",
                          border: "none",
                          outline: "none",
                          textAlign: isSNo ? "center" : "left",
                          backgroundColor: isSNo ? "#f1f5f9" : "transparent",
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

      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
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
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>+</span> Add New Asset
        </button>
        
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 25px",
            background: "#0ea5e9",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📥 Export Infrastructure Report
        </button>
      </div>
    </>
  );
};