import React, { useEffect } from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const StationaryRegister = ({ rows, setRows, month, branch }) => {
  useEffect(() => {
    if (!rows || rows.length === 0) {
      setRows([
        {
          id: Date.now(),
          date: new Date().toISOString().split("T")[0],
          staffName: "",
          itemName: "",
          openingStock: 0,
          todayTaken: 0,
          closingBalance: 0,
          reason: "",
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
        staffName: "",
        itemName: "",
        openingStock: 0,
        todayTaken: 0,
        closingBalance: 0,
        reason: "",
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
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          const updatedRow = { ...r, [col]: val };


          if (col === "openingStock" || col === "todayTaken") {
            const opening =
              parseInt(col === "openingStock" ? val : r.openingStock) || 0;
            const taken =
              parseInt(col === "todayTaken" ? val : r.todayTaken) || 0;
            updatedRow.closingBalance = opening - taken;
          }
          return updatedRow;
        }
        return r;
      }),
    );
  };


  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      Date: row.date,
      "Staff/Person Name": row.staffName || "-",
      "Item Name": row.itemName || "-",
      "Opening Stock": row.openingStock || 0,
      "Quantity Taken Today": row.todayTaken || 0,
      "Closing Balance (Current)": row.closingBalance || 0,
      "Reason / Purpose": row.reason || "-",
    }));

    downloadExcelFile(
      dataToExport,
      "Stationary_Status_Register",
      branch,
      month,
    );
  };

  const columns = [
    { label: "Date", key: "date", width: "150px" },
    { label: "Taken Name", key: "staffName", width: "180px" },
    { label: "Stock Name", key: "itemName", width: "160px" },
    { label: "Opening Stock", key: "openingStock", width: "110px" },
    { label: "Today Taken", key: "todayTaken", width: "110px" },
    { label: "Current Balance", key: "closingBalance", width: "110px" },
    { label: "Reason", key: "reason", width: "200px" },
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
              <tr key={row.id}>
                <td
                  style={{ textAlign: "center", border: "1px solid #e2e8f0" }}
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
                    {col.key === "closingBalance" ? (
                      <div
                        style={{
                          ...inputStyle,
                          background:
                            row.closingBalance === 0 ? "#fee2e2" : "#f0fdf4",
                          fontWeight: "bold",
                          textAlign: "center",
                          color:
                            row.closingBalance <= 2 ? "#ef4444" : "#059669",
                        }}
                      >
                        {row.closingBalance}
                      </div>
                    ) : (
                      <input
                        type={
                          col.key.includes("Stock") ||
                          col.key.includes("Taken") ||
                          col.key.includes("Balance")
                            ? "number"
                            : col.key === "date"
                              ? "date"
                              : "text"
                        }
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={inputStyle}
                        placeholder="..."
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
          }}
        >
          <span>+</span> Add New Record
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
          }}
        >
          📥 Download Stock Sheet
        </button>
      </div>
    </div>
  );
};
