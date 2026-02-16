import React, { useEffect } from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const HardwareRegister = ({ rows, setRows, month, branch }) => {
  useEffect(() => {
    if (!rows || rows.length === 0) {
      setRows([createNewRow()]);
    }
  }, [rows, setRows]);

  const createNewRow = () => ({
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    itemName: "",
    buyerName: "",
    initialStock: 0,
    pickedQuantity: 0,
    remainingStock: 0,
    remarks: "",
  });

  const onAddRow = () => {
    setRows([...rows, createNewRow()]);
  };

  const onRemoveRow = (id) => {
    if (rows.length > 1) {
      setRows(rows.filter((r) => r.id !== id));
    }
  };

  const onCellChange = (id, col, val) => {
    let updatedRawRows = rows.map((r) =>
      r.id === id ? { ...r, [col]: val } : r,
    );

    let inventoryLedger = {};

    const calculatedRows = updatedRawRows.map((row) => {
      const item = (row.itemName || "").trim().toLowerCase();
      const stockIn = parseFloat(row.initialStock) || 0;
      const picked = parseFloat(row.pickedQuantity) || 0;

      if (!item) {
        return { ...row, remainingStock: stockIn - picked };
      }

      let currentBalance = 0;
      if (!inventoryLedger[item]) {
        currentBalance = stockIn - picked;
        inventoryLedger[item] = currentBalance;
      } else {
        currentBalance = inventoryLedger[item] + stockIn - picked;
        inventoryLedger[item] = currentBalance;
      }

      return {
        ...row,
        remainingStock: currentBalance,
      };
    });

    setRows(calculatedRows);
  };

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      "Hardware Item": row.itemName,
      "Stock Added": row.initialStock,
      "Taken By": row.buyerName,
      "Quantity Picked": row.pickedQuantity,
      "Balance Stock": row.remainingStock,
      Date: row.date,
      Remarks: row.remarks,
    }));
    downloadExcelFile(dataToExport, "Hardware_Inventory_Report", branch, month);
  };


  const columns = [
    { label: "S.No", key: "sno", width: "60px" },
     { label: "Hardware Name", key: "itemName", width: "200px" },
    { label: "Stock In", key: "initialStock", width: "100px" },
    { label: "Taken By", key: "buyerName", width: "160px" },
    { label: "Pick Qty", key: "pickedQuantity", width: "100px" },
    { label: "Remaining", key: "remainingStock", width: "110px" },
    { label: "Date", key: "date", width: "160px" },
    { label: "Remarks", key: "remarks", width: "200px" },
  ];

  const commonInputStyle = {
    width: "100%",
    height: "42px",
    padding: "0 10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
    display: "block",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          background: "#fff",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          maxHeight: "70vh",
        }}
      >
        <table
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
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
                  width: "50px",
                  padding: "12px",
                  borderBottom: "1px solid #e2e8f0",
                  color: "#0f766e",
                }}
              >
                Del
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    padding: "12px 10px",
                    borderBottom: "1px solid #e2e8f0",
                    borderLeft: "1px solid #e2e8f0",
                    color: "#0f766e",
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "left",
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
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #e2e8f0",
                    padding: "5px",
                  }}
                >
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "#fee2e2",
                      borderRadius: "50%",
                      cursor: "pointer",
                      width: "26px",
                      height: "26px",
                    }}
                  >
                    ×
                  </button>
                </td>

                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      borderLeft: "1px solid #e2e8f0",
                      padding: 0,
                    }}
                  >
                    {col.key === "sno" ? (
                      <div
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          color: "#64748b",
                        }}
                      >
                        {index + 1}
                      </div>
                    ) : col.key === "remainingStock" ? (
                      <div
                        style={{
                          ...commonInputStyle,
                          lineHeight: "42px",
                          fontWeight: "700",
                          color: row[col.key] < 5 ? "#dc2626" : "#059669",
                          textAlign: "center",
                        }}
                      >
                        {row[col.key]}
                      </div>
                    ) : (
                      <input
                        type={
                          col.key === "date"
                            ? "date"
                            : col.key === "initialStock" ||
                                col.key === "pickedQuantity"
                              ? "number"
                              : "text"
                        }
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={commonInputStyle}
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
          marginTop: "25px",
        }}
      >
        <button
          onClick={onAddRow}
          style={{
            padding: "12px 24px",
            background: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Hardware Entry
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: "12px 24px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          📥 Download Inventory
        </button>
      </div>
    </div>
  );
};
