import React from "react";

export const StaffSelectionTelecalling = ({ rows, setRows, branch, month }) => {
  const onAddRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        candidateName: "",
        mobile: "",
        position: "",
        experience: "",
        expectedSalary: "",
        qualification: "",
        status: "Screening",
        eventDate: "",
        remarks: "",
      },
    ]);
  };

  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
  };

  const onCellChange = (id, col, val) => {
    if (col === "mobile") {
      const onlyNums = val.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setRows(rows.map((r) => (r.id === id ? { ...r, [col]: onlyNums } : r)));
      }
      return;
    }
    setRows(rows.map((r) => (r.id === id ? { ...r, [col]: val } : r)));
  };

  const sendWhatsApp = (row) => {
    const { mobile, candidateName, position, status, eventDate } = row;
    if (mobile.length !== 10)
      return alert("Enter valid 10-digit mobile number");

    let message = "";
    if (status === "Interview Scheduled") {
      message = `Hello ${candidateName}, this is from HR Dept. Your interview for the ${position} position is scheduled on ${eventDate || "[Date Not Set]"}. Please confirm your availability.`;
    } else if (status === "Selected") {
      message = `Congratulations ${candidateName}! You have been selected for the ${position} role. Your joining date is ${eventDate || "[Date Not Set]"}. We look forward to having you on board.`;
    } else {
      message = `Hello ${candidateName}, we are reaching out regarding your application for the ${position} position.`;
    }

    const url = `https://wa.me/91${mobile}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const otherColumns = [
    { label: "Date", key: "date", width: "160px" },
    { label: "Mobile No", key: "mobile", width: "180px" },
    { label: "Position", key: "position", width: "160px" },
    { label: "Exp (Yrs)", key: "experience", width: "90px" },
    { label: "Status", key: "status", width: "200px" },
    { label: "Event Date", key: "eventDate", width: "160px" },
    { label: "Expected Sal", key: "expectedSalary", width: "130px" },
    { label: "Remarks", key: "remarks", width: "250px" },
  ];

  const commonThStyle = {
    padding: "12px",
    color: "#0f766e",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    textAlign: "left",
    background: "#f0fdf4",
    position: "sticky",
    top: 0,
    zIndex: 20,
  };

  const stickyTdStyle = (leftOffset, zIndex = 10) => ({
    position: "sticky",
    left: leftOffset,
    background: "#fff",
    zIndex: zIndex,
    border: "1px solid #e2e8f0",
  });

  const inputStyle = {
    width: "100%",
    height: "42px",
    padding: "0 10px",
    border: "none",
    outline: "none",
    fontSize: "13px",
    background: "transparent",
    display: "block",
    boxSizing: "border-box",
    WebkitAppearance: "none",
  };

  return (
    <div style={{ padding: "5px" }}>
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
          style={{
            width: "max-content",
            borderCollapse: "separate",
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  ...commonThStyle,
                  left: 0,
                  zIndex: 30,
                  width: "50px",
                  textAlign: "center",
                }}
              >
                Del
              </th>
              <th
                style={{
                  ...commonThStyle,
                  left: "50px",
                  zIndex: 30,
                  width: "60px",
                  textAlign: "center",
                }}
              >
                S.No
              </th>
              <th
                style={{
                  ...commonThStyle,
                  left: "110px",
                  zIndex: 30,
                  width: "220px",
                }}
              >
                Candidate Name
              </th>
              {otherColumns.map((col) => (
                <th
                  key={col.key}
                  style={{ ...commonThStyle, width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td style={{ ...stickyTdStyle(0), textAlign: "center" }}>
                  <button
                    onClick={() => onRemoveRow(row.id)}
                    style={{
                      color: "#ef4444",
                      background: "#fee2e2",
                      border: "none",
                      borderRadius: "50%",
                      width: "26px",
                      height: "26px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </td>
                <td
                  style={{
                    ...stickyTdStyle("50px"),
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#64748b",
                  }}
                >
                  {index + 1}
                </td>
                <td style={{ ...stickyTdStyle("110px"), padding: 0 }}>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={row.candidateName || ""}
                    onChange={(e) =>
                      onCellChange(row.id, "candidateName", e.target.value)
                    }
                    style={{ ...inputStyle, fontWeight: "600" }}
                  />
                </td>

                {otherColumns.map((col) => (
                  <td
                    key={col.key}
                    style={{ border: "1px solid #e2e8f0", padding: 0 }}
                  >
                    {col.key === "mobile" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: "42px",
                        }}
                      >
                        <input
                          type="text"
                          maxLength={10}
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            onCellChange(row.id, col.key, e.target.value)
                          }
                          style={{
                            ...inputStyle,
                            color:
                              row[col.key]?.length === 10
                                ? "#059669"
                                : "#ef4444",
                          }}
                        />
                        {row[col.key]?.length === 10 && (
                          <div
                            onClick={() => sendWhatsApp(row)}
                            style={{
                              cursor: "pointer",
                              paddingRight: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 448 512"
                              fill="#25D366"
                            >
                              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.6-30.6-38.1-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : col.key === "status" ? (
                      <select
                        value={row[col.key]}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        <option value="Screening">🔍 Screening</option>
                        <option value="Shortlisted">✅ Shortlisted</option>
                        <option value="Interview Scheduled">
                          📅 Interview Scheduled
                        </option>
                        <option value="Selected">🎉 Selected</option>
                        <option value="Rejected">❌ Rejected</option>
                      </select>
                    ) : col.key === "eventDate" || col.key === "date" ? (
                      <input
                        type="date"
                        value={row[col.key] || ""}
                        onChange={(e) =>
                          onCellChange(row.id, col.key, e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          background:
                            col.key === "eventDate" &&
                            row.status === "Interview Scheduled"
                              ? "#fffbeb"
                              : col.key === "eventDate" &&
                                  row.status === "Selected"
                                ? "#f0fdf4"
                                : "transparent",
                          visibility:
                            col.key === "date" ||
                            row.status === "Interview Scheduled" ||
                            row.status === "Selected"
                              ? "visible"
                              : "hidden",
                        }}
                      />
                    ) : (
                      <input
                        type="text"
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
      <button
        onClick={onAddRow}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "#0f766e",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        + Add New Candidate
      </button>
    </div>
  );
};
