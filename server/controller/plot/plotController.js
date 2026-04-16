import fs from 'fs';
import db from '../../db.js';

const STATUS_TEXT = { O: 'Open', S: 'Sold', B: 'Booked', R: 'Reserved', H: 'Hold' };
const toStatusText = (s) => STATUS_TEXT[s] ?? 'Unknown';

const calcStats = (plots) => {
  let available = 0, sold = 0, booked = 0, hold = 0, reserved = 0;
  let totalValue = 0, totalArea = 0;

  for (const p of plots) {
    if (p.status === 'O') available++;
    else if (p.status === 'S') sold++;
    else if (p.status === 'B') booked++;
    else if (p.status === 'H') hold++;
    else if (p.status === 'R') reserved++;
    totalValue += parseFloat(p.price) || 0;
    totalArea += parseFloat(p.area) || 0;
  }

  const total = plots.length;
  return {
    total_plots: total,
    available_plots: available,
    sold_plots: sold,
    booked_plots: booked,
    hold_plots: hold,
    reserved_plots: reserved,
    total_value: totalValue,
    total_area: totalArea,
    average_price_per_plot: total > 0 ? +(totalValue / total).toFixed(2) : 0,
    average_area_per_plot: total > 0 ? +(totalArea / total).toFixed(2) : 0,
  };
};

const shapePlot = (p) => ({
  project_id: p.project_id,
  plot_sr: p.plot_sr,
  plot_no: p.plot_no,
  area: p.area,
  price: p.price,
  survey_no: p.survey_no,
  status: p.status,
  plot_type: p.plot_type,
  status_text: toStatusText(p.status),
  customer_name: p.customer_name,
  reference_by: p.reference_by,
  book_date: p.book_date,
  book_amount: p.book_amount,
  sold_date: p.sold_date,
  sold_amount: p.sold_amount,
  vc_remarks: p.vc_remarks,
  cX: p.cX,
  cY: p.cY,
  created_at: p.c_at,
  created_by: p.c_by,
  updated_at: p.u_at,
  updated_by: p.u_by,
});

const dbQuery = (sql, params = []) =>
  new Promise((resolve, reject) =>
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
  );
export const AddPlotProperty = (req, res) => {
  try {
    let propertyData, plots, userId;
    try {
      propertyData = JSON.parse(req.body.propertyData);
      plots = JSON.parse(req.body.plots);
      userId = JSON.parse(req.body.userId);
    } catch (parseError) {
      return res.status(400).json({
        message: "Invalid data format",
        error: parseError.message
      });
    }

    // Get the uploaded file if exists
    const uploadedFile = req.file;
    let filePath = null;
    let fileName = null;

    if (uploadedFile) {
      filePath = `uploads/plots/${uploadedFile.filename}`;
      fileName = uploadedFile.filename;
    }

    const currentDate = new Date();
    const formattedDateTime = currentDate.toISOString().replace("T", " ").slice(0, 19);

    // First, get the max project_id
    const getMaxIdSql = "SELECT MAX(project_id) as max_id FROM xx_project_master";

    db.query(getMaxIdSql, (err, result) => {
      if (err) {
        // Clean up uploaded file if database operation fails
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return res.status(500).json({
          message: "Error getting max project_id",
          error: err.message
        });
      }

      // Calculate new project_id
      const maxId = result[0]?.max_id || 0;
      const newProjectId = parseInt(maxId) + 1;

      // Insert into xx_project_master with the new project_id and file_path
      const masterSql = `INSERT INTO xx_project_master 
        (project_id, project_name, nick_name, add1, add2, add3, city, pin_code, district, state, 
         ext_code, area, geo_location, project_type, status, file_path, c_at, c_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const masterValues = [
        newProjectId,
        propertyData.project_name,
        propertyData.nick_name,
        propertyData.add1,
        propertyData.add2,
        propertyData.add3,
        propertyData.city,
        propertyData.pin_code,
        propertyData.district,
        propertyData.state,
        propertyData.ext_code,
        propertyData.area_name,
        propertyData.geo_location || null,
        propertyData.project_type,
        propertyData.status,
        filePath,
        formattedDateTime,
        userId || 0
      ];

      db.query(masterSql, masterValues, (err, masterResult) => {
        if (err) {
          // Clean up uploaded file if database operation fails
          if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          return res.status(500).json({
            message: "Error inserting project master data",
            error: err.message
          });
        }

        // Prepare plots data for insertion
        if (!plots || plots.length === 0) {
          return res.status(200).json({
            message: "Project created successfully but no plots added",
            project_id: newProjectId,
            file_uploaded: !!filePath,
            file_path: filePath
          });
        }

        const plotRecords = [];
        for (const plot of plots) {
          plotRecords.push([
            newProjectId,
            plot.plot_sr,
            plot.plot_no,
            plot.area,
            plot.price,
            plot.survey_no,
            plot.status,
            plot.plot_type,
            plot.customer_name || null,
            plot.book_date || null,
            plot.book_amount || null,
            plot.sold_date || null,
            plot.sold_amount || null,
            plot.vc_remarks || null,
            formattedDateTime,
            userId,
            formattedDateTime,
            userId,
            plot.cX || null,
            plot.cY || null
          ]);
        }

        // Insert into xx_project_plot
        const plotSql = `INSERT INTO xx_project_plot 
          (project_id, plot_sr, plot_no, area, price, survey_no, status, plot_type, customer_name, book_date, book_amount, sold_date, sold_amount, vc_remarks, c_at, c_by, u_at, u_by, cX, cY) VALUES ?`;

        db.query(plotSql, [plotRecords], (plotErr) => {
          if (plotErr) {
            // If plot insertion fails, delete the project master record and clean up file
            const deleteSql = "DELETE FROM xx_project_master WHERE project_id = ?";
            db.query(deleteSql, [newProjectId], () => {
              if (filePath && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
              return res.status(500).json({
                message: "Error inserting plot data",
                error: plotErr.message
              });
            });
          } else {
            res.status(200).json({
              code: 200,
              status: true,
              message: "Project and plots added successfully",
              project_id: newProjectId,
              plots_added: plots.length
            });
          }
        });
      });
    });

  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const projectsSql = `
      SELECT
        p.project_id,
        p.project_name,
        p.nick_name,
        p.add1, p.add2, p.add3,
        p.city, p.pin_code, p.district, p.state,
        p.ext_code, p.geo_location, p.project_type,
        p.status, p.file_path,
        p.c_at, p.c_by, p.u_at, p.u_by,
        COUNT(pl.plot_sr)  AS total_plots,
        SUM(pl.status = 'O') AS available_plots,
        SUM(pl.status = 'S') AS sold_plots,
        SUM(pl.status = 'B') AS booked_plots,
        SUM(pl.status = 'H') AS hold_plots,
        SUM(pl.status = 'R') AS reserved_plots,
        COALESCE(SUM(pl.price), 0) AS total_value,
        COALESCE(SUM(pl.area),  0) AS total_area
      FROM xx_project_master p
      LEFT JOIN xx_project_plot pl ON pl.project_id = p.project_id
      GROUP BY p.project_id
      ORDER BY p.project_id DESC
    `;

    const projects = await dbQuery(projectsSql);

    const data = projects.map((p) => ({
      project_details: {
        project_id: p.project_id,
        project_name: p.project_name,
        nick_name: p.nick_name,
        address: {
          line1: p.add1, line2: p.add2, line3: p.add3,
          city: p.city, pin_code: p.pin_code,
          district: p.district, state: p.state,
        },
        ext_code: p.ext_code,
        geo_location: p.geo_location,
        project_type: p.project_type,
        file_path: p.file_path,
        status: p.status,
        created_at: p.c_at, created_by: p.c_by,
        updated_at: p.u_at, updated_by: p.u_by,
      },
      project_statistics: {
        total_plots: +p.total_plots,
        available_plots: +p.available_plots,
        sold_plots: +p.sold_plots,
        booked_plots: +p.booked_plots,
        hold_plots: +p.hold_plots,
        reserved_plots: +p.reserved_plots,
        total_value: +p.total_value,
        total_area: +p.total_area,
        average_price_per_plot: p.total_plots > 0 ? +(p.total_value / p.total_plots).toFixed(2) : 0,
        average_area_per_plot: p.total_plots > 0 ? +(p.total_area / p.total_plots).toFixed(2) : 0,
      },
    }));

    res.json({ success: true, total_projects: data.length, data });
  } catch (error) {
    console.error('[getAllProjects]', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getProjectPlotById = (req, res) => {
  try {
    const { project_id, plot_sr } = req.params;

    if (!project_id || !plot_sr) {
      return res.status(400).json({
        success: false,
        message: "project_id and plot_sr are required"
      });
    }

    // 1️⃣ Get project details
    const projectSql = `
      SELECT * 
      FROM xx_project_master 
      WHERE project_id = ?
    `;

    db.query(projectSql, [project_id], (err, projectResult) => {
      if (err) {
        return res.status(500).json({
          message: "Error fetching project",
          error: err.message
        });
      }

      if (projectResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Project not found"
        });
      }

      const project = projectResult[0];

      // 2️⃣ Get specific plot
      const plotSql = `
        SELECT *
        FROM xx_project_plot
        WHERE project_id = ? AND plot_sr = ?
      `;

      db.query(plotSql, [project_id, plot_sr], (plotErr, plotResult) => {
        if (plotErr) {
          return res.status(500).json({
            message: "Error fetching plot",
            error: plotErr.message
          });
        }

        if (plotResult.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Plot not found"
          });
        }

        const plot = plotResult[0];

        // 3️⃣ Format plot
        const formattedPlot = {
          plot_no: plot.plot_no,
          plot_sr: plot.plot_sr,
          area: plot.area,
          price: plot.price,
          survey_no: plot.survey_no,
          status: plot.status,
          status_text:
            plot.status === "A"
              ? "Available"
              : plot.status === "S"
                ? "Sold"
                : plot.status === "B"
                  ? "Booked"
                  : "Unknown",
          customer_name: plot.customer_name,
          book_date: plot.book_date,
          book_amount: plot.book_amount,
          sold_date: plot.sold_date,
          sold_amount: plot.sold_amount,
          vc_remarks: plot.vc_remarks,
          cX: plot.cX,
          cY: plot.cY,
          created_at: plot.c_at,
          created_by: plot.c_by,
          updated_at: plot.u_at,
          updated_by: plot.u_by
        };

        // 4️⃣ Final response
        const finalData = {
          project_details: {
            project_id: project.project_id,
            project_name: project.project_name,
            nick_name: project.nick_name,
            address: {
              line1: project.add1,
              line2: project.add2,
              line3: project.add3,
              city: project.city,
              pin_code: project.pin_code,
              district: project.district,
              state: project.state
            },
            ext_code: project.ext_code,
            geo_location: project.geo_location,
            project_type: project.project_type,
            status: project.status,
            created_at: project.c_at,
            created_by: project.c_by,
            updated_at: project.u_at,
            updated_by: project.u_by
          },
          plot: formattedPlot
        };

        res.status(200).json({
          success: true,
          data: finalData
        });
      });
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

export const UpdatePlotProperty = (req, res) => {
  try {
    const { project_id, plot_sr, plot_no, area, price, survey_no, status, plot_type, customer_name, reference_by, book_date, book_amount, sold_date, sold_amount, vc_remarks } = req.body.formData;
    const userId = req.body.UserId;

    if (!project_id || !plot_sr || !plot_no) {
      return res.status(400).json({ message: 'project_id , plot_sr, plot_no is required' });
    }

    const sql = `
      UPDATE xx_project_plot SET
        plot_no = ?, area = ?, price = ?, survey_no = ?, status = ?, plot_type = ?, customer_name = ?, reference_by =?, book_date = ?, book_amount = ?, sold_date = ?,
        sold_amount = ?, vc_remarks = ?, u_at = NOW(), u_by = ?
      WHERE project_id = ? AND plot_sr = ?
    `;

    const values = [plot_no, area, price, survey_no, status, plot_type, customer_name, reference_by, book_date, book_amount, sold_date, sold_amount, vc_remarks, userId, project_id, plot_sr];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Database error", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Plot not found" });
      }

      res.status(200).json({ message: "Plot updated successfully", data: result });
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const updatePlotMaster = (req, res) => {
  try {
    const { project_id, project_name, nick_name, add1, add2, add3, city, pin_code, area, district, state, ext_code, project_type, status
    } = req.body;

    const sql = `
      UPDATE xx_project_master SET
        project_name = ?,
        nick_name = ?,
        add1 = ?,
        add2 = ?,
        add3 = ?,
        city = ?,
        pin_code = ?,
        area = ?,
        district = ?,
        state = ?,
        ext_code = ?,
        project_type = ?,
        status = ?
      WHERE project_id = ?
    `;

    db.query(sql, [
      project_name, nick_name, add1, add2, add3,
      city, pin_code, area, district, state,
      ext_code, project_type, status, project_id
    ], (err, results) => {
      if (err) {
        return res.status(400).json({ message: "Error updating project details." });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Project not found." });
      }

      res.status(200).json({
        code: 200,
        status: true,
        message: "Project details updated successfully."
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const { project_id } = req.params;

    if (!project_id || isNaN(Number(project_id))) {
      return res.status(400).json({ message: 'Valid project_id is required' });
    }

    // Run both queries in parallel
    const [projectRows, plotRows] = await Promise.all([
      dbQuery('SELECT * FROM xx_project_master WHERE project_id = ? LIMIT 1', [project_id]),
      dbQuery(
        `SELECT plot_sr, project_id, plot_no, area, price, survey_no, status, plot_type,
                customer_name, reference_by, book_date, book_amount,
                sold_date, sold_amount, vc_remarks, cX, cY,
                c_at, c_by, u_at, u_by
         FROM xx_project_plot
         WHERE project_id = ?
         ORDER BY plot_sr`,
        [project_id]
      ),
    ]);

    if (!projectRows.length) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const p = projectRows[0];
    const plots = plotRows.map(shapePlot);

    res.json({
      success: true,
      data: {
        project_details: {
          project_id: p.project_id,
          project_name: p.project_name,
          nick_name: p.nick_name,
          address: {
            line1: p.add1, line2: p.add2, line3: p.add3,
            city: p.city, pin_code: p.pin_code,
            district: p.district, state: p.state,
          },
          ext_code: p.ext_code,
          area: p.area,
          geo_location: p.geo_location,
          project_type: p.project_type,
          file_path: p.file_path,
          status: p.status,
          created_at: p.c_at, created_by: p.c_by,
          updated_at: p.u_at, updated_by: p.u_by,
        },
        project_statistics: calcStats(plotRows),
        plots,
      },
    });
  } catch (error) {
    console.error('[getProjectDetails]', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getPlotsFromStatus = async (req, res) => {
  try {
    const { projectId, plotStatus, page = 1, limit = 200 } = req.body;

    if (!projectId || !plotStatus) {
      return res.status(400).json({ message: 'projectId and plotStatus are required' });
    }

    const validStatuses = ['O', 'S', 'B', 'H', 'R'];
    if (!validStatuses.includes(plotStatus)) {
      return res.status(400).json({ message: `plotStatus must be one of: ${validStatuses.join(', ')}` });
    }

    const offset = (Math.max(1, +page) - 1) * Math.min(500, +limit);
    const pageSize = Math.min(500, +limit);

    const sql = `
      SELECT
        project_id, plot_sr, plot_no, area, price,
        survey_no, status, plot_type,
        customer_name, reference_by,
        book_date, book_amount,          -- fixed: was missing comma
        sold_date, sold_amount,
        vc_remarks
      FROM xx_project_plot
      WHERE project_id = ? AND status = ?
      ORDER BY plot_sr
      LIMIT ? OFFSET ?
    `;

    const results = await dbQuery(sql, [projectId, plotStatus, pageSize, offset]);
    res.json(results);
  } catch (error) {
    console.error('[getPlotsFromStatus]', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};