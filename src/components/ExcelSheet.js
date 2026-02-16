import React from "react";

const ExcelSheet = ({ columns, rows, onCellChange, onAddRow, onRemoveRow }) => (
  <div style={{ overflowX: "auto" }}>
    <table
      border="1"
      style={{ width: "100%", borderCollapse: "collapse", background: "white" }}
    >
      <thead style={{ background: "#eee" }}>
        <tr>
          <th>Action</th>
          {columns.map((c) => (
            <th key={c} style={{ padding: "8px" }}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td style={{ textAlign: "center" }}>
              <button
                onClick={() => onRemoveRow(row.id)}
                style={{ color: "red" }}
              >
                X
              </button>
            </td>
            {columns.map((col) => (
              <td key={col}>
                <input
                  style={{ width: "95%", border: "none", padding: "5px" }}
                  value={row[col] || ""}
                  onChange={(e) => onCellChange(row.id, col, e.target.value)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <button onClick={onAddRow} style={{ marginTop: "10px" }}>
      + Add Row
    </button>
  </div>
);

export default ExcelSheet;
