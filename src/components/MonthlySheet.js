import React from "react";

const MonthlySheet = ({ rows, onCellChange, onAddRow, onRemoveRow }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>Action</th>
            <th>Name</th>
            {days.map((d) => (
              <th key={d}>{d}</th>
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
              <td>
                <input
                  value={row.name || ""}
                  onChange={(e) => onCellChange(row.id, "name", e.target.value)}
                />
              </td>
              {days.map((d) => (
                <td key={d}>
                  <input
                    style={{
                      width: "25px",
                      border: "none",
                      textAlign: "center",
                    }}
                    value={row[d] || ""}
                    onChange={(e) => onCellChange(row.id, d, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onAddRow} style={{ marginTop: "10px" }}>
        + Add Person
      </button>
    </div>
  );
};

export default MonthlySheet;