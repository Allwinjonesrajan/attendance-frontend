import React, { useEffect } from "react";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const FeesRegister = ({ rows, setRows, month, branch }) => {

  useEffect(() => {
    if (!rows || rows.length === 0) {
      setRows([createNewRow()]);
    }
  }, [rows, setRows]);

  const createNewRow = () => ({
    id: Date.now(),
    date: new Date().toISOString().split("T")[0],
    studentName: "",
    mobileNumber: "",
    courseName: "",
    totalFees: 0,
    discountPercent: 0,
    discountAmount: 0,
    prevBalance: 0,
    payAmount: 0,
    pendingAmount: 0,
    dueDate: "",
    paymentMode: "Cash",
  });

  const onAddRow = () => setRows([...rows, createNewRow()]);

  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
  };


  const onCellChange = (id, col, val) => {
    let updatedRawRows = rows.map((r) =>
      r.id === id ? { ...r, [col]: val } : r,
    );

    let studentLedger = {};
    const calculatedRows = updatedRawRows.map((row) => {
      const name = (row.studentName || "").trim().toLowerCase();
      const total = parseFloat(row.totalFees) || 0;
      const dPercent = parseFloat(row.discountPercent) || 0;
      const dAmount = (total * dPercent) / 100;
      const paid = parseFloat(row.payAmount) || 0;

      let currentPrevBal = 0;
      let currentPending = 0;

      if (!name) {
        currentPending = total - dAmount - paid;
      } else if (!studentLedger[name]) {
        currentPrevBal = total - dAmount;
        currentPending = currentPrevBal - paid;
        studentLedger[name] = currentPending;
      } else {
        currentPrevBal = studentLedger[name];
        currentPending = currentPrevBal - paid;
        studentLedger[name] = currentPending;
      }

      return {
        ...row,
        discountAmount: dAmount,
        prevBalance: currentPrevBal,
        pendingAmount: currentPending,
      };
    });
    setRows(calculatedRows);
  };

  const handleDownload = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      Date: row.date,
      Student: row.studentName,
      Mobile: row.mobileNumber,
      Course: row.courseName,
      "Total Fees": row.totalFees,
      "Disc %": row.discountPercent + "%",
      Paid: row.payAmount,
      Mode: row.paymentMode,
      "Net Bal": row.pendingAmount,
    }));
    downloadExcelFile(dataToExport, "Fees_Ledger_Report", branch, month);
  };


  const sendWhatsApp = (row) => {
    if (!row.mobileNumber || !row.studentName) {
      alert("Enter Name and Mobile number first!");
      return;
    }

    const message =
      `*FEES RECEIPT - ${branch}*%0A%0A` +
      `Dear *${row.studentName}*,%0A` +
      `Payment received for *${row.courseName}*.%0A%0A` +
      `*Summary:*%0A` +
      `Total Fees: ₹${row.totalFees}%0A` +
      `Discount: ${row.discountPercent}% (₹${row.discountAmount})%0A` +
      `Paid Through: *${row.paymentMode}*%0A` +
      `Amount Paid: *₹${row.payAmount}*%0A` +
      `*Balance Pending: ₹${row.pendingAmount}*%0A%0A` +
      (row.pendingAmount > 0
        ? `Kindly settle the balance by *${row.dueDate || "the due date"}*.%0A`
        : "Account cleared. Thank you!%0A") +
        `UPI Link: jbhvbbvhvbbvbviwiv` +
      `%0ARegards,%0A*${branch}*`;

    window.open(
      `https://wa.me/91${row.mobileNumber}?text=${message}`,
      "_blank",
    );
  };


  const totalCollected = rows.reduce(
    (sum, r) => sum + (parseFloat(r.payAmount) || 0),
    0,
  );
  const cashTotal = rows
    .filter((r) => r.paymentMode === "Cash")
    .reduce((sum, r) => sum + (parseFloat(r.payAmount) || 0), 0);
  const onlineTotal = rows
    .filter((r) => r.paymentMode === "Online")
    .reduce((sum, r) => sum + (parseFloat(r.payAmount) || 0), 0);

  const columns = [
    { label: "Student Name", key: "studentName", width: "180px" },
    { label: "Mobile", key: "mobileNumber", width: "130px" },
    { label: "Course", key: "courseName", width: "140px" },
    { label: "Total", key: "totalFees", width: "90px" },
    { label: "Disc %", key: "discountPercent", width: "70px" },
    { label: "Paid", key: "payAmount", width: "90px" },
    { label: "Mode", key: "paymentMode", width: "110px" },
    { label: "Balance", key: "pendingAmount", width: "110px" },
    { label: "Due Date", key: "dueDate", width: "140px" },
    { label: "Msg", key: "actions", width: "120px" },
  ];

  return (
    <div style={{ padding: "10px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div
          style={{
            flex: 1,
            padding: "15px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}
          >
            OVERALL COLLECTED
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#0f172a" }}
          >
            ₹{totalCollected}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "15px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "11px", color: "#166534", fontWeight: "bold" }}
          >
            CASH TOTAL
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#15803d" }}
          >
            ₹{cashTotal}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "15px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div
            style={{ fontSize: "11px", color: "#1e40af", fontWeight: "bold" }}
          >
            ONLINE TOTAL
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "bold", color: "#1d4ed8" }}
          >
            ₹{onlineTotal}
          </div>
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          border: "1px solid #cbd5e1",
          borderRadius: "12px",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "max-content",
            minWidth: "100%",
            borderCollapse: "separate",
          }}
        >
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={{ padding: "15px" }}>Del</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width,
                    padding: "10px",
                    color: "#0f766e",
                    textAlign: "left",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      border: "none",
                      background: "#fee2e2",
                      borderRadius: "4px",
                      cursor: "pointer",
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
                      padding: "4px",
                    }}
                  >
                    {col.key === "pendingAmount" ? (
                      <div
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          color: row[col.key] > 0 ? "#dc2626" : "#059669",
                        }}
                      >
                        ₹{row[col.key]}
                      </div>
                    ) : col.key === "paymentMode" ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={{
                          padding: "8px",
                          borderRadius: "4px",
                          border: "1px solid #cbd5e1",
                          width: "100%",
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                      </select>
                    ) : col.key === "actions" ? (
                      <div style={{ display: "flex", gap: "5px" }}>
                        <button
                          onClick={() => sendWhatsApp(row)}
                          style={{
                            padding: "5px 8px",
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          WHATSAPP
                        </button>
                        
                      </div>
                    ) : (
                      <input
                        type={
                          col.key === "dueDate"
                            ? "date"
                            : col.key === "studentName" ||
                                col.key === "courseName"
                              ? "text"
                              : "number"
                        }
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={{
                          width: "90%",
                          border: "1px solid #f1f5f9",
                          padding: "8px",
                        }}
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={onAddRow}
          style={{
            padding: "10px 20px",
            background: "#0f766e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Add Row
        </button>
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};
