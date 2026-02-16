import React from "react";
import { jsPDF } from "jspdf";
import { downloadExcelFile } from "../../../utils/downloadExcelFile";

export const getHallTicketCols = () => {
  return [
    "S.No",
    "Student Name",
    "Roll Number",
    "Department",
    "Year/Sem",
    "Hall Ticket No",
    "No Dues Status",
    "Issued Date",
    "Issued By",
    "Receiver Signature",
    "Action",
    "Remarks",
  ];
};

export const HallTicketIssueRegister = ({ rows, setRows, branch, month }) => {
  const handleImageUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onCellChange(id, "Receiver Signature", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const downloadSingleTicket = (student) => {
    const doc = new jsPDF("p", "mm", "a4");
    const logoUrl = "/assets/logo.png";

    const generatePDF = (logoBase64) => {
      doc.setLineWidth(0.7);
      doc.rect(10, 10, 190, 277);
      doc.setLineWidth(0.2);
      doc.rect(12, 12, 186, 273);

      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 155, 18, 35, 35);
      } else {
        doc.setDrawColor(200);
        doc.rect(160, 20, 30, 30);
      }

      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(branch || "Attendance INSTITUTE", 20, 30);

      doc.setFontSize(16);
      doc.setFont("helvetica", "normal");
      doc.text("EXAMINATION HALL TICKET", 20, 40);

      doc.line(20, 50, 145, 50);

      let y = 75;
      const xLabel = 25;
      const xValue = 80;
      const lineHeight = 12;

      const details = [
        ["Student Name", student["Student Name"]],
        ["Roll Number", student["Roll Number"]],
        ["Department", student["Department"]],
        ["Hall Ticket No", student["Hall Ticket No"]],
        ["Year / Sem", student["Year/Sem"]],
        ["No Dues Status", student["No Dues Status"]],
        ["Issued Date", student["Issued Date"]],
        ["Issued By", student["Issued By"]],
      ];

      details.forEach(([label, value]) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${label}`, xLabel, y);
        doc.setFont("helvetica", "normal");
        doc.text(`:  ${value || "N/A"}`, xValue, y);
        y += lineHeight;
      });

      if (student["Remarks"]) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.text("Remarks:", 25, 230);
        doc.text(`${student["Remarks"]}`, 25, 237);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Authorized Signature", 165, 260, { align: "center" });

      if (student["Receiver Signature"]) {
        try {
          doc.addImage(student["Receiver Signature"], "PNG", 145, 235, 40, 20);
        } catch (e) {
          console.error("Invalid signature format");
        }
      } else {
        doc.line(145, 255, 185, 255);
      }

      doc.save(`${student["Student Name"] || "Student"}_HallTicket.pdf`);
    };

    const img = new Image();
    img.src = logoUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      generatePDF(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      console.warn("Logo not found, generating without logo.");
      generatePDF(null);
    };
  };

  const handleDownloadExcel = () => {
    const dataToExport = rows.map((row, index) => ({
      "S.No": index + 1,
      "Student Name": row["Student Name"] || "-",
      "Roll Number": row["Roll Number"] || "-",
      Department: row["Department"] || "-",
      "Hall Ticket No": row["Hall Ticket No"] || "-",
      "No Dues Status": row["No Dues Status"] || "Pending",
      Remarks: row["Remarks"] || "-",
    }));
    downloadExcelFile(dataToExport, "HallTicket_Register", branch, month);
  };

  const currentCols = getHallTicketCols();
  const onAddRow = () => setRows([...rows, { id: Date.now() }]);
  const onRemoveRow = (id) => {
    if (rows.length > 1) setRows(rows.filter((r) => r.id !== id));
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
              zIndex: 100,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#eff6ff",
                  position: "sticky",
                  left: 0,
                  zIndex: 110,
                  width: "40px",
                }}
              >
                {" "}
                ×{" "}
              </th>
              {currentCols.map((col) => {
                const isSticky =
                  col === "S.No" ||
                  col === "Student Name" ||
                  col === "Roll Number";
                let leftPos = 0;
                if (col === "S.No") leftPos = 40;
                if (col === "Student Name") leftPos = 100;
                if (col === "Roll Number") leftPos = 320;
                return (
                  <th
                    key={col}
                    style={{
                      padding: "12px 8px",
                      border: "1px solid #e2e8f0",
                      color: "#1e40af",
                      minWidth: "130px",
                      position: isSticky ? "sticky" : "static",
                      left: isSticky ? leftPos : "auto",
                      background: "#eff6ff",
                      zIndex: isSticky ? 110 : 1,
                      textAlign: "center",
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
                      fontSize: "16px",
                    }}
                  >
                    {" "}
                    ×{" "}
                  </button>
                </td>
                {currentCols.map((col) => {
                  const isSticky =
                    col === "S.No" ||
                    col === "Student Name" ||
                    col === "Roll Number";
                  let leftPos = 0;
                  if (col === "S.No") leftPos = 40;
                  if (col === "Student Name") leftPos = 100;
                  if (col === "Roll Number") leftPos = 320;

                  if (col === "Receiver Signature") {
                    return (
                      <td
                        key={col}
                        style={{
                          border: "1px solid #e2e8f0",
                          padding: "5px",
                          textAlign: "center",
                        }}
                      >
                        {row[col] ? (
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <img
                              src={row[col]}
                              alt="sign"
                              style={{ height: "35px" }}
                            />
                            <button
                              onClick={() => onCellChange(row.id, col, null)}
                              style={{
                                position: "absolute",
                                top: -5,
                                right: -10,
                                background: "red",
                                color: "white",
                                borderRadius: "50%",
                                border: "none",
                                cursor: "pointer",
                                padding: "0 5px",
                                fontSize: "10px",
                              }}
                            >
                              {" "}
                              x{" "}
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(row.id, e.target.files[0])
                            }
                            style={{ fontSize: "10px", width: "150px" }}
                          />
                        )}
                      </td>
                    );
                  }

                  if (col === "Action") {
                    return (
                      <td
                        key={col}
                        style={{
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          padding: "5px",
                        }}
                      >
                        <button
                          onClick={() => downloadSingleTicket(row)}
                          style={{
                            background: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          {" "}
                          Download{" "}
                        </button>
                      </td>
                    );
                  }

                  return (
                    <td
                      key={col}
                      style={{
                        border: "1px solid #e2e8f0",
                        position: isSticky ? "sticky" : "static",
                        left: isSticky ? leftPos : "auto",
                        background: isSticky ? "#fff" : "transparent",
                        zIndex: isSticky ? 10 : 1,
                        padding: 0,
                      }}
                    >
                      <input
                        value={col === "S.No" ? index + 1 : row[col] || ""}
                        readOnly={col === "S.No"}
                        onChange={(e) =>
                          onCellChange(row.id, col, e.target.value)
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          padding: "12px 10px",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          display: "block",
                          boxSizing: "border-box",
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
            background: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {" "}
          + Add Student{" "}
        </button>
        <button
          onClick={handleDownloadExcel}
          style={{
            marginLeft: "10px",
            padding: "12px 25px",
            background: "#059669",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {" "}
          📥 Full Register{" "}
        </button>
      </div>
    </>
  );
};
