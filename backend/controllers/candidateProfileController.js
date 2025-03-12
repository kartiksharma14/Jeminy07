const OTP = require("../models/otp");
const TemporaryUsers = require("../models/temporaryUsers");
const User = require("../models/user");

// candidateProfileController.js
const { sequelize } = require("../db");
const Signin = require("../models/user");
const CandidateProfile = require("../models/candidateProfile");
const Education = require("../models/education");
const EmploymentDetails = require("../models/employmentdetails");
const Projects = require("../models/projects");
const keyskills = require("../models/keyskills");
const itSkills = require("../models/itSkills");
const jobPost = require('../models/jobpost');
const { JobApplication } = require('../models/jobApplications');
const { Op, Sequelize } = require("sequelize");
const cities = require('../data/cities.json');


// ==================== Education Handlers ====================

// POST - Add new education record
exports.addEducationRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const educationData = Array.isArray(req.body) ? req.body : [req.body];

    const createdRecords = await Education.bulkCreate(educationData.map(record => ({
      ...record,
      candidate_id
    })));

    res.status(200).json({
      message: "Education records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addEducationRecord:', error);
    res.status(500).json({
      message: "Error adding education records",
      error: error.message
    });
  }
};

// PATCH - Update specific education record
exports.updateEducationRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Format dates if present
    if (updateData.coursestart_year) {
      updateData.coursestart_year = new Number(updateData.coursestart_year);
    }
    if (updateData.courseend_year) {
      updateData.courseend_year = new Number(updateData.courseend_year);
    }

    const record = await Education.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Education record not found"
      });
    }

    await record.update(updateData);

    res.status(200).json({
      success: true,
      message: "Education record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating education record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating education record",
      error: error.message
    });
  }
};

// DELETE - Delete specific education record
exports.deleteEducationRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const deleted = await Education.destroy({
      where: { education_id: record_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Education record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Education record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting education record:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting education record",
      error: error.message
    });
  }
};

// ==================== Employment Handlers ====================

// POST - Add new employment record
/*exports.addEmploymentRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const employmentData = Array.isArray(req.body) ? req.body : [req.body];

    const createdRecords = await EmploymentDetails.bulkCreate(employmentData.map(record => ({
      ...record,
      candidate_id
    })));

    res.status(200).json({
      message: "Employment records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addEmploymentRecord:', error);
    res.status(500).json({
      message: "Error adding employment records",
      error: error.message
    });
  }
};

// PATCH - Update specific employment record
exports.updateEmploymentRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Format date if present
    if (updateData.joining_date) {
      updateData.joining_date = new Date(updateData.joining_date);
    }

    const record = await EmploymentDetails.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found"
      });
    }

    await record.update(updateData);

    res.status(200).json({
      success: true,
      message: "Employment record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating employment record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating employment record",
      error: error.message
    });
  }
};*/

// DELETE - Delete specific employment record
exports.deleteEmploymentRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const deleted = await EmploymentDetails.destroy({
      where: { employment_id: record_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Employment record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting employment record:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting employment record",
      error: error.message
    });
  }
};


const calculateTotalExperience = async (candidateId) => {
  try {
    const employmentRecords = await EmploymentDetails.findAll({
      where: { candidate_id: candidateId },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('experience_in_year')), 'total_years'],
        [sequelize.fn('SUM', sequelize.col('experience_in_months')), 'total_months']
      ],
      raw: true
    });

    let totalYears = Number(employmentRecords[0].total_years) || 0;
    let totalMonths = Number(employmentRecords[0].total_months) || 0;

    // Convert excess months to years
    if (totalMonths >= 12) {
      const additionalYears = Math.floor(totalMonths / 12);
      totalYears += additionalYears;
      totalMonths = totalMonths % 12;
    }

    return {
      total_years: totalYears,
      total_months: totalMonths
    };
  } catch (error) {
    console.error('Error calculating total experience:', error);
    throw error;
  }
};


// POST - Add new employment record
/*exports.addEmploymentRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const employmentData = Array.isArray(req.body) ? req.body : [req.body];

    const processedRecords = employmentData.map(record => {
      const isCurrent = record.is_current_employment === 'Yes' || record.is_current_employment === true;
      const isFullTime = record.employment_type === 'Full-Time';
      
      // Process company name based on current status
      let companyName = null;
      if (isCurrent) {
        companyName = record.current_company_name;
      } else {
        companyName = record.previous_company_name;
      }
      
      // Process job title for Full-Time positions
      let jobTitle = null;
      if (isFullTime) {
        if (isCurrent) {
          jobTitle = record.current_job_title;
        } else {
          jobTitle = record.previous_job_title;
        }
      }
      
      // Base record with common fields
      const processedRecord = {
        candidate_id,
        current_employment: isCurrent ? 'Yes' : 'No',
        employment_type: record.employment_type,
        joining_date: record.joining_year && record.joining_month ? 
                     new Date(record.joining_year, record.joining_month - 1, 1) : null,
        currently_working: isCurrent
      };
      
      // Assign company name to appropriate field
      if (isCurrent) {
        processedRecord.current_company_name = companyName;
      } else {
        processedRecord.previous_company_name = companyName;
        // Add worked_till date for non-current positions
        if (record.worked_till_year && record.worked_till_month) {
          processedRecord.worked_till = new Date(
            record.worked_till_year, 
            record.worked_till_month - 1, 
            1
          );
          processedRecord.end_date = processedRecord.worked_till; // For backward compatibility
        }
      }
      
      // Handle employment type-specific fields
      if (isFullTime) {
        // Full-Time specific fields
        if (isCurrent) {
          // Current Full-Time
          processedRecord.current_job_title = jobTitle;
          processedRecord.experience_in_year = parseInt(record.experience_years || 0);
          processedRecord.experience_in_months = parseInt(record.experience_months || 0);
          processedRecord.current_salary = record.current_salary || null;
          processedRecord.skill_used = record.skills_used || null;
          processedRecord.job_profile = record.job_profile || null;
          processedRecord.notice_period = record.notice_period || null;
        } else {
          // Previous Full-Time
          processedRecord.previous_job_title = jobTitle;
          processedRecord.job_profile = record.job_profile || null;
        }
      } else {
        // Internship fields
        processedRecord.company_location = record.location || null;
        processedRecord.department = record.department || null;
        processedRecord.monthly_stipend = record.monthly_stipend || null;
      }
      
      return processedRecord;
    });

    const createdRecords = await EmploymentDetails.bulkCreate(processedRecords);

    res.status(200).json({
      message: "Employment records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addEmploymentRecord:', error);
    res.status(500).json({
      message: "Error adding employment records",
      error: error.message
    });
  }
};

// PATCH - Update specific employment record
exports.updateEmploymentRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;
    
    // Find the existing record
    const record = await EmploymentDetails.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found"
      });
    }
    
    // Determine employment type and current status
    const isCurrent = updateData.is_current_employment ? 
                     (updateData.is_current_employment === 'Yes' || updateData.is_current_employment === true) :
                     (record.current_employment === 'Yes');
                     
    const isFullTime = updateData.employment_type ? 
                      updateData.employment_type === 'Full-Time' :
                      record.employment_type === 'Full-Time';
    
    // Process update data
    const processedUpdate = {};
    
    // Update common fields if provided
    if (updateData.employment_type) {
      processedUpdate.employment_type = updateData.employment_type;
    }
    
    if ('is_current_employment' in updateData) {
      processedUpdate.current_employment = isCurrent ? 'Yes' : 'No';
      processedUpdate.currently_working = isCurrent;
    }
    
    // Handle company name
    if (isCurrent && updateData.current_company_name) {
      processedUpdate.current_company_name = updateData.current_company_name;
    } else if (!isCurrent && updateData.previous_company_name) {
      processedUpdate.previous_company_name = updateData.previous_company_name;
    }
    
    // Handle dates
    if (updateData.joining_year && updateData.joining_month) {
      processedUpdate.joining_date = new Date(
        updateData.joining_year, 
        updateData.joining_month - 1, 
        1
      );
    }
    
    if (!isCurrent && updateData.worked_till_year && updateData.worked_till_month) {
      processedUpdate.worked_till = new Date(
        updateData.worked_till_year, 
        updateData.worked_till_month - 1, 
        1
      );
      processedUpdate.end_date = processedUpdate.worked_till; // For backward compatibility
    }
    
    // Handle Full-Time specific fields
    if (isFullTime) {
      if (isCurrent) {
        // Current Full-Time
        if (updateData.current_job_title) {
          processedUpdate.current_job_title = updateData.current_job_title;
        }
        
        if ('experience_years' in updateData) {
          processedUpdate.experience_in_year = parseInt(updateData.experience_years);
        }
        
        if ('experience_months' in updateData) {
          processedUpdate.experience_in_months = parseInt(updateData.experience_months);
        }
        
        if (updateData.current_salary) {
          processedUpdate.current_salary = updateData.current_salary;
        }
        
        if (updateData.skills_used) {
          processedUpdate.skill_used = updateData.skills_used;
        }
        
        if (updateData.notice_period) {
          processedUpdate.notice_period = updateData.notice_period;
        }
      } else {
        // Previous Full-Time
        if (updateData.previous_job_title) {
          processedUpdate.previous_job_title = updateData.previous_job_title;
        }
      }
      
      // Common for both current and previous Full-Time
      if (updateData.job_profile) {
        processedUpdate.job_profile = updateData.job_profile;
      }
    } else {
      // Internship fields
      if (updateData.location) {
        processedUpdate.company_location = updateData.location;
      }
      
      if (updateData.department) {
        processedUpdate.department = updateData.department;
      }
      
      if (updateData.monthly_stipend) {
        processedUpdate.monthly_stipend = updateData.monthly_stipend;
      }
    }
    
    // Update the record
    await record.update(processedUpdate);
    
    res.status(200).json({
      success: true,
      message: "Employment record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating employment record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating employment record",
      error: error.message
    });
  }
};



// Validation middleware for employment record
exports.validateEmploymentRecord = (req, res, next) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const errors = [];
    
    data.forEach((record, index) => {
      const prefix = data.length > 1 ? `Record ${index + 1}: ` : '';
      
      // Check required fields
      if (!record.is_current_employment) {
        errors.push(`${prefix}Current employment status (Yes/No) is required`);
      }
      
      if (!record.employment_type) {
        errors.push(`${prefix}Employment type (Full-Time/Internship) is required`);
      }
      
      const isCurrent = record.is_current_employment === 'Yes' || record.is_current_employment === true;
      const isFullTime = record.employment_type === 'Full-Time';
      
      // Check company name
      if (isCurrent && !record.current_company_name) {
        errors.push(`${prefix}Current company name is required`);
      } else if (!isCurrent && !record.previous_company_name) {
        errors.push(`${prefix}Previous company name is required`);
      }
      
      // Check joining date
      if (!record.joining_year || !record.joining_month) {
        errors.push(`${prefix}Joining date (year and month) is required`);
      }
      
      // Check Full-Time specific fields
      if (isFullTime) {
        if (isCurrent) {
          if (!record.current_job_title) {
            errors.push(`${prefix}Current job title is required for Full-Time current employment`);
          }
          
          if (record.experience_years === undefined || record.experience_months === undefined) {
            errors.push(`${prefix}Total experience (years and months) is required for Full-Time current employment`);
          }
          
          if (!record.notice_period) {
            errors.push(`${prefix}Notice period is required for Full-Time current employment`);
          }
        } else {
          if (!record.previous_job_title) {
            errors.push(`${prefix}Previous job title is required for Full-Time previous employment`);
          }
          
          if (!record.worked_till_year || !record.worked_till_month) {
            errors.push(`${prefix}Worked till date is required for previous employment`);
          }
        }
      } 
      // Check Internship specific fields
      else if (record.employment_type === 'Internship') {
        if (!record.location) {
          errors.push(`${prefix}Location is required for Internship`);
        }
        
        if (!record.department) {
          errors.push(`${prefix}Department is required for Internship`);
        }
        
        if (!record.monthly_stipend) {
          errors.push(`${prefix}Monthly stipend is required for Internship`);
        }
        
        if (!isCurrent && (!record.worked_till_year || !record.worked_till_month)) {
          errors.push(`${prefix}Worked till date is required for previous Internship`);
        }
      }
    });
    
    // If errors found, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
    
    // If no errors, proceed
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: "Error validating employment record",
      error: error.message
    });
  }
};*/




// POST - Add new employment record
// POST - Add new employment record
exports.addEmploymentRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const employmentData = Array.isArray(req.body) ? req.body : [req.body];

    const processedRecords = employmentData.map(record => {
      const isCurrent = record.is_current_employment === 'Yes' || record.is_current_employment === true;
      const isFullTime = record.employment_type === 'Full-Time';
      
      // Base record with common fields
      const processedRecord = {
        candidate_id,
        current_employment: isCurrent ? 'Yes' : 'No',
        employment_type: record.employment_type,
        joining_year: parseInt(record.joining_year) || null,
        joining_month: parseInt(record.joining_month) || null,
        currently_working: isCurrent
      };
      
      // Handle company name based on current/previous
      if (isCurrent) {
        processedRecord.current_company_name = record.current_company_name || null;
      } else {
        processedRecord.previous_company_name = record.previous_company_name || null;
        
        // Handle worked_till date for non-current positions
        if (record.worked_till) {
          processedRecord.worked_till = record.worked_till;
        }
      }
      
      // Handle employment type-specific fields
      if (isFullTime) {
        // Full-Time specific fields
        if (isCurrent) {
          // Current Full-Time
          processedRecord.current_job_title = record.current_job_title || null;
          processedRecord.experience_in_year = parseInt(record.experience_years || 0);
          processedRecord.experience_in_months = parseInt(record.experience_months || 0);
          processedRecord.total_experience_in_years = parseInt(record.total_experience_years || 0);
          processedRecord.total_experience_in_months = parseInt(record.total_experience_months || 0);
          processedRecord.current_salary = record.current_salary || null;
          processedRecord.skill_used = record.skills_used || null;
          processedRecord.job_profile = record.job_profile || null;
          processedRecord.notice_period = record.notice_period || null;
        } else {
          // Previous Full-Time
          processedRecord.previous_job_title = record.previous_job_title || null;
          processedRecord.job_profile = record.job_profile || null;
          processedRecord.total_experience_in_years = parseInt(record.total_experience_years || 0);
          processedRecord.total_experience_in_months = parseInt(record.total_experience_months || 0);
        }
      } else {
        // Internship fields
        processedRecord.location = record.location || null;
        processedRecord.department = record.department || null;
        processedRecord.monthly_stipend = record.monthly_stipend || null;
      }
      
      return processedRecord;
    });

    const createdRecords = await EmploymentDetails.bulkCreate(processedRecords);

    res.status(200).json({
      message: "Employment records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addEmploymentRecord:', error);
    res.status(500).json({
      message: "Error adding employment records",
      error: error.message
    });
  }
};

// PATCH - Update specific employment record
exports.updateEmploymentRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;
    
    // Find the existing record
    const record = await EmploymentDetails.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Employment record not found"
      });
    }
    
    // Determine employment type and current status
    const isCurrent = updateData.is_current_employment ? 
                     (updateData.is_current_employment === 'Yes' || updateData.is_current_employment === true) :
                     (record.current_employment === 'Yes');
                     
    const isFullTime = updateData.employment_type ? 
                      updateData.employment_type === 'Full-Time' :
                      record.employment_type === 'Full-Time';
    
    // Process update data
    const processedUpdate = {};
    
    // Update common fields if provided
    if (updateData.employment_type) {
      processedUpdate.employment_type = updateData.employment_type;
    }
    
    if ('is_current_employment' in updateData) {
      processedUpdate.current_employment = isCurrent ? 'Yes' : 'No';
      processedUpdate.currently_working = isCurrent;
    }
    
    // Update joining year/month if provided
    if (updateData.joining_year) {
      processedUpdate.joining_year = parseInt(updateData.joining_year);
    }
    
    if (updateData.joining_month) {
      processedUpdate.joining_month = parseInt(updateData.joining_month);
    }
    
    // Handle company name
    if (isCurrent && updateData.current_company_name) {
      processedUpdate.current_company_name = updateData.current_company_name;
    } else if (!isCurrent && updateData.previous_company_name) {
      processedUpdate.previous_company_name = updateData.previous_company_name;
    }
    
    // Handle worked_till for non-current jobs
    if (!isCurrent && updateData.worked_till) {
      processedUpdate.worked_till = updateData.worked_till;
    }
    
    // Update total experience if provided
    if (updateData.total_experience_years) {
      processedUpdate.total_experience_in_years = parseInt(updateData.total_experience_years);
    }
    
    if (updateData.total_experience_months) {
      processedUpdate.total_experience_in_months = parseInt(updateData.total_experience_months);
    }
    
    // Handle Full-Time specific fields
    if (isFullTime) {
      if (isCurrent) {
        // Current Full-Time
        if (updateData.current_job_title) {
          processedUpdate.current_job_title = updateData.current_job_title;
        }
        
        if ('experience_years' in updateData) {
          processedUpdate.experience_in_year = parseInt(updateData.experience_years);
        }
        
        if ('experience_months' in updateData) {
          processedUpdate.experience_in_months = parseInt(updateData.experience_months);
        }
        
        if (updateData.current_salary) {
          processedUpdate.current_salary = updateData.current_salary;
        }
        
        if (updateData.skills_used) {
          processedUpdate.skill_used = updateData.skills_used;
        }
        
        if (updateData.notice_period) {
          processedUpdate.notice_period = updateData.notice_period;
        }
      } else {
        // Previous Full-Time
        if (updateData.previous_job_title) {
          processedUpdate.previous_job_title = updateData.previous_job_title;
        }
      }
      
      // Common for both current and previous Full-Time
      if (updateData.job_profile) {
        processedUpdate.job_profile = updateData.job_profile;
      }
    } else {
      // Internship fields
      if (updateData.location) {
        processedUpdate.location = updateData.location;
      }
      
      if (updateData.department) {
        processedUpdate.department = updateData.department;
      }
      
      if (updateData.monthly_stipend) {
        processedUpdate.monthly_stipend = updateData.monthly_stipend;
      }
    }
    
    // Update the record
    await record.update(processedUpdate);
    
    res.status(200).json({
      success: true,
      message: "Employment record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating employment record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating employment record",
      error: error.message
    });
  }
};

// Validation middleware for employment record
exports.validateEmploymentRecord = (req, res, next) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const errors = [];
    
    data.forEach((record, index) => {
      const prefix = data.length > 1 ? `Record ${index + 1}: ` : '';
      
      // Check required fields
      if (!record.is_current_employment) {
        errors.push(`${prefix}Current employment status (Yes/No) is required`);
      }
      
      if (!record.employment_type) {
        errors.push(`${prefix}Employment type (Full-Time/Internship) is required`);
      }
      
      const isCurrent = record.is_current_employment === 'Yes' || record.is_current_employment === true;
      const isFullTime = record.employment_type === 'Full-Time';
      
      // Check company name
      if (isCurrent && !record.current_company_name) {
        errors.push(`${prefix}Current company name is required`);
      } else if (!isCurrent && !record.previous_company_name) {
        errors.push(`${prefix}Previous company name is required`);
      }
      
      // Check joining date
      if (!record.joining_year || !record.joining_month) {
        errors.push(`${prefix}Joining date (year and month) is required`);
      }
      
      // Check Full-Time specific fields
      if (isFullTime) {
        if (isCurrent) {
          if (!record.current_job_title) {
            errors.push(`${prefix}Current job title is required for Full-Time current employment`);
          }
          
          if (record.experience_years === undefined || record.experience_months === undefined) {
            errors.push(`${prefix}Experience (years and months) is required for Full-Time current employment`);
          }
          
          if (record.total_experience_years === undefined || record.total_experience_months === undefined) {
            errors.push(`${prefix}Total experience (years and months) is required for Full-Time employment`);
          }
          
          if (!record.notice_period) {
            errors.push(`${prefix}Notice period is required for Full-Time current employment`);
          }
        } else {
          if (!record.previous_job_title) {
            errors.push(`${prefix}Previous job title is required for Full-Time previous employment`);
          }
          
          if (record.total_experience_years === undefined || record.total_experience_months === undefined) {
            errors.push(`${prefix}Total experience (years and months) is required for Full-Time employment`);
          }
          
          if (!record.worked_till) {
            errors.push(`${prefix}Worked till date is required for previous employment`);
          }
        }
      } 
      // Check Internship specific fields
      else if (record.employment_type === 'Internship') {
        if (!record.location) {
          errors.push(`${prefix}Location is required for Internship`);
        }
        
        if (!record.department) {
          errors.push(`${prefix}Department is required for Internship`);
        }
        
        if (!record.monthly_stipend) {
          errors.push(`${prefix}Monthly stipend is required for Internship`);
        }
        
        if (!isCurrent && !record.worked_till) {
          errors.push(`${prefix}Worked till date is required for previous Internship`);
        }
      }
    });
    
    // If errors found, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }
    
    // If no errors, proceed
    next();
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: "Error validating employment record",
      error: error.message
    });
  }
};


// ==================== Projects Handlers ====================

// POST - Add new project record
exports.addProjectRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const projectData = Array.isArray(req.body) ? req.body : [req.body];

    const createdRecords = await Projects.bulkCreate(projectData.map(record => ({
      ...record,
      candidate_id
    })));

    res.status(200).json({
      message: "Project records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addProjectRecord:', error);
    res.status(500).json({
      message: "Error adding project records",
      error: error.message
    });
  }
};

// PATCH - Update specific project record
exports.updateProjectRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Format dates if present
    if (updateData.project_start_date) {
      updateData.project_start_date = new Date(updateData.project_start_date);
    }
    if (updateData.project_end_date) {
      updateData.project_end_date = new Date(updateData.project_end_date);
    }

    const record = await Projects.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Project record not found"
      });
    }

    await record.update(updateData);

    res.status(200).json({
      success: true,
      message: "Project record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating project record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating project record",
      error: error.message
    });
  }
};

// DELETE - Delete specific project record
exports.deleteProjectRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const deleted = await Projects.destroy({
      where: { project_id: record_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Project record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting project record:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting project record",
      error: error.message
    });
  }
};

// ==================== Keyskills Handlers ====================

// POST - Add new keyskills record
exports.addKeyskillsRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const keyskillsData = Array.isArray(req.body) ? req.body : [req.body];

    const createdRecords = await keyskills.bulkCreate(keyskillsData.map(record => ({
      ...record,
      candidate_id
    })));

    res.status(200).json({
      message: "Keyskills records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addKeyskillsRecord:', error);
    res.status(500).json({
      message: "Error adding keyskills records",
      error: error.message
    });
  }
};

// PATCH - Update specific keyskills record
exports.updateKeyskillsRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Validate keyskillsname
    if (!updateData.keyskillsname || typeof updateData.keyskillsname !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid 'keyskillsname'. Provide a non-empty string."
      });
    }

    const record = await keyskills.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Keyskills record not found"
      });
    }

    await record.update(updateData);

    res.status(200).json({
      success: true,
      message: "Keyskills record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating keyskills record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating keyskills record",
      error: error.message
    });
  }
};

// DELETE - Delete specific keyskills record
exports.deleteKeyskillsRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const deleted = await keyskills.destroy({
      where: { keyskills_id: record_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Keyskills record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Keyskills record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting keyskills record:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting keyskills record",
      error: error.message
    });
  }
};

// ==================== IT Skills Handlers ====================

// POST - Add new IT skills record
exports.addITSkillsRecord = async (req, res) => {
  try {
    const { candidate_id } = req.params;
    const itSkillsData = Array.isArray(req.body) ? req.body : [req.body];

    const createdRecords = await itSkills.bulkCreate(itSkillsData.map(record => ({
      ...record,
      candidate_id
    })));

    res.status(200).json({
      message: "IT skills records added successfully",
      data: createdRecords
    });
  } catch (error) {
    console.error('Error in addITSkillsRecord:', error);
    res.status(500).json({
      message: "Error adding IT skills records",
      error: error.message
    });
  }
};

// PATCH - Update specific IT skills record
exports.updateITSkillsRecord = async (req, res) => {
  try {
    const { record_id } = req.params;
    const updateData = req.body;

    // Validate IT skills update data
    if (!updateData.itskills_name && !updateData.itskills_proficiency) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update: 'itskills_name' or 'itskills_proficiency'"
      });
    }

    const record = await itSkills.findByPk(record_id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "IT skills record not found"
      });
    }

    await record.update(updateData);

    res.status(200).json({
      success: true,
      message: "IT skills record updated successfully",
      data: record
    });
  } catch (error) {
    console.error('Error updating IT skills record:', error);
    res.status(500).json({
      success: false,
      message: "Error updating IT skills record",
      error: error.message
    });
  }
};

// DELETE - Delete specific IT skills record
exports.deleteITSkillsRecord = async (req, res) => {
  try {
    const { record_id } = req.params;

    const deleted = await itSkills.destroy({
      where: { itskills_id: record_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "IT skills record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "IT skills record deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting IT skills record:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting IT skills record",
      error: error.message
    });
  }
};



exports.getUserDetails = async (req, res) => {
  try {
    const { candidate_id } = req.params;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    const [signinData, profileData, educationData, employmentData, projectsData, keyskillsData, itskillsData] = await Promise.all([
      Signin.findOne({
        where: { candidate_id },
        attributes: ["candidate_id", "name", "email", "phone", "resume"],
      }),
      CandidateProfile.findOne({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }),
      Education.findAll({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['courseend_year', 'DESC']]
      }),
      EmploymentDetails.findAll({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['joining_date', 'DESC']]
      }),
      Projects.findAll({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        order: [['project_end_date', 'DESC']]
      }),
      keyskills.findAll({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }),
      itSkills.findAll({
        where: { candidate_id },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      })
    ]);

    if (!signinData) {
      if (res) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      throw new Error("Candidate not found");
    }

    // Calculate total experience from employment records
    const totalExperience = employmentData.reduce((acc, emp) => {
      return {
        years: acc.years + (emp.experience_in_year || 0),
        months: acc.months + (emp.experience_in_months || 0)
      };
    }, { years: 0, months: 0 });

    // Adjust months if they exceed 12
    if (totalExperience.months >= 12) {
      totalExperience.years += Math.floor(totalExperience.months / 12);
      totalExperience.months = totalExperience.months % 12;
    }

    // Safe date formatting function
    const formatDate = (date) => {
      if (!date) return null;
      // If it's already a string in YYYY-MM-DD format, return as is
      if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}/)) {
        return date.split('T')[0];
      }
      // If it's a Date object or can be converted to one
      try {
        const d = new Date(date);
        if (d.toString() === 'Invalid Date') return null;
        return d.toISOString().split('T')[0];
      } catch {
        return null;
      }
    };

    // Format the data with all relationships
    const combinedData = {
      ...signinData.get({ plain: true }),
      ...(profileData ? profileData.get({ plain: true }) : {}),
      profile_last_updated: profileData?.profile_last_updated
        ? formatDate(profileData.profile_last_updated)
        : null,
      total_experience: {
        years: totalExperience.years,
        months: totalExperience.months,
        formatted: `${totalExperience.years} years ${totalExperience.months} months`
      },
      education: educationData.map(edu => ({
        ...edu.get({ plain: true }),
        coursestart_year: edu.coursestart_year,
        courseend_year: edu.courseend_year
      })),
      employment: employmentData.map(emp => ({
        ...emp.get({ plain: true }),
        joining_date: formatDate(emp.joining_date)
      })),
      projects: projectsData.map(proj => ({
        ...proj.get({ plain: true }),
        project_start_date: formatDate(proj.project_start_date),
        project_end_date: formatDate(proj.project_end_date)
      })),
      keyskills: keyskillsData.map(skill => skill.get({ plain: true })),
      itskills: itskillsData.map(skill => skill.get({ plain: true }))
    };

    // If called as middleware, return the data
    if (!res) return combinedData;

    // If called as endpoint, send response
    return res.status(200).json({
      message: "Candidate profile fetched successfully",
      data: combinedData,
    });
  } catch (error) {
    console.error("Error fetching candidate details:", error);
    if (res) {
      return res.status(500).json({
        error: "An error occurred while fetching candidate details",
        details: error.message,
      });
    }
    throw error;
  }
};


exports.updateUserDetails = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { candidate_id } = req.params;
    const { education, employment, projects, location, ...profileData } = req.body;

    if (!candidate_id) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }

    // Ensure candidate exists in `signin`
    const candidateExists = await Signin.findOne({ where: { candidate_id } });
    if (!candidateExists) {
      await transaction.rollback();
      return res.status(404).json({ error: "Candidate not found in signin table" });
    }

    // If location provided, validate it exists in cities.json
    if (location) {
      const cityExists = cities.cities.some(
        (city) => city.City.toLowerCase() === location.toLowerCase()
      );

      if (!cityExists) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Invalid city",
        });
      }

      // Include location in profileData to update the profile
      profileData.location = location;
    }

    // Ensure `candidate_profile` exists or create it
    const [candidateProfile] = await CandidateProfile.findOrCreate({
      where: { candidate_id },
      defaults: {
        candidate_id,
        phone: candidateExists.phone || null,
        resume: candidateExists.resume || null,
      },
      transaction,
    });

    // Merge default `phone` and `resume` into `profileData` if not provided
    profileData.phone = profileData.phone || candidateProfile.phone || null;
    profileData.resume = profileData.resume || candidateProfile.resume || null;

    // Update `CandidateProfile` and `Signin` only if there is data to update
    if (Object.keys(profileData).length > 0) {
      await CandidateProfile.update(profileData, {
        where: { candidate_id },
        transaction,
      });

      if (profileData.phone || profileData.resume) {
        await Signin.update(
          {
            phone: profileData.phone,
            resume: profileData.resume,
          },
          { where: { candidate_id }, transaction }
        );
      }
    }

    // Update education records
    if (Array.isArray(education) && education.length > 0) {
      await Education.destroy({ where: { candidate_id }, transaction });
      const educationData = education.map((edu) => ({
        ...edu,
        candidate_id,
        coursestart_year: edu.coursestart_year
          ? new Date(edu.coursestart_year).getFullYear()
          : null,
        courseend_year: edu.courseend_year
          ? new Date(edu.courseend_year).getFullYear()
          : null,
      }));
      await Education.bulkCreate(educationData, { transaction });
    }

    // Update employment records
    if (Array.isArray(employment) && employment.length > 0) {
      await EmploymentDetails.destroy({ where: { candidate_id }, transaction });
      const employmentData = employment.map((emp) => ({
        ...emp,
        candidate_id,
        joining_date: emp.joining_date ? new Date(emp.joining_date) : null,
      }));
      await EmploymentDetails.bulkCreate(employmentData, { transaction });
    }

    // Update projects
    if (Array.isArray(projects) && projects.length > 0) {
      await Projects.destroy({ where: { candidate_id }, transaction });
      const projectData = projects.map((proj) => ({
        ...proj,
        candidate_id,
        project_start_date: proj.project_start_date
          ? new Date(proj.project_start_date).toISOString().split("T")[0]
          : null,
        project_end_date: proj.project_end_date
          ? new Date(proj.project_end_date).toISOString().split("T")[0]
          : null,
      }));
      await Projects.bulkCreate(projectData, { transaction });
    }

    // Commit the transaction
    await transaction.commit();

    // Fetch and return updated profile using the existing getUserDetails function
    const updatedProfile = await exports.getUserDetails({ params: { candidate_id } });

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Error updating candidate details:", error);
    res.status(500).json({
      error: "An error occurred while updating candidate details",
      details: error.message,
    });
  }
};

exports.getCandidatesByExperience = async (req, res) => {   
  try {     
    const { min_experience, max_experience } = req.query;      
    const minExp = parseFloat(min_experience);     
    const maxExp = parseFloat(max_experience);      
    
    if (isNaN(minExp) || isNaN(maxExp)) {       
      return res.status(400).json({         
        error: "Both minimum and maximum experience values are required and must be numbers",       
      });     
    }      
    
    if (minExp > maxExp) {       
      return res.status(400).json({         
        error: "Minimum experience cannot be greater than maximum experience",       
      });     
    }      
    
    const candidates = await CandidateProfile.findAll({       
      include: [
        {
          model: EmploymentDetails,
          where: {
            experience_in_year: {
              [Op.gte]: minExp,
              [Op.lte]: maxExp,
            },
          },
          required: true,
        },
        {
          model: Education,
          required: false // Set to false to get candidates even if they don't have education details
        },
        {
          model: Projects,
          required: false
        },
        {
          model: itSkills,
          required: false, // Include even if no project details
        },
        {
          model: keyskills,
          required: false, // Include even if no project details
        },
        {
          model: Signin,
          attributes: ['name', 'email'],
          required: true,
        }
      ],
      order: [[EmploymentDetails, 'experience_in_year', 'ASC']],
    });      
    
    if (!candidates || candidates.length === 0) {       
      return res.status(404).json({         
        error: `No candidates found with experience between ${minExp} and ${maxExp} years`,       
      });     
    }      
    
    const formattedCandidates = candidates.map((candidate) =>       
      candidate.get({ plain: true })     
    );      
    
    res.status(200).json({       
      total_candidates: formattedCandidates.length,       
      data: formattedCandidates,     
    });   
  } catch (error) {     
    console.error("Error fetching candidates:", error);     
    res.status(500).json({       
      error: "An error occurred while fetching candidates",       
      details: error.message,     
    });   
  } 
};



exports.searchCandidatesByCity = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location query is required",
      });
    }

    const candidates = await CandidateProfile.findAll({
      where: {
        location: {
          [Op.like]: `%${location}%`,
        },
      },
      include: [
        {
          model: EmploymentDetails,
          required: false,
        },
        {
          model: Education,
          required: false,
        },
        {
          model: Projects,
          required: false,
        },
        {
          model: itSkills,
          required: false,
          // Add specific attributes you want to retrieve
          attributes: ['itskills_name', 'itskills_proficiency'],
          // If there's an association table, you might need to include it here
        },
        {
          model: keyskills,
          required: false,
          // Add specific attributes you want to retrieve
          attributes: ['keyskillsname'],
          // If there's an association table, you might need to include it here
        },
        {
          model: Signin,
          attributes: ["name", "email"],
          required: true,
        },
      ],
    });

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No candidates found in ${location}`,
      });
    }

    // Transform the response to handle arrays properly
    const formattedCandidates = candidates.map(candidate => {
      const plainCandidate = candidate.get({ plain: true });
      
      // Ensure itSkills and keyskills are properly formatted arrays
      return {
        ...plainCandidate,
        itSkills: plainCandidate.itSkills || [],
        keyskills: plainCandidate.keyskills || []
      };
    });

    res.status(200).json({
      success: true,
      total_candidates: formattedCandidates.length,
      data: formattedCandidates,
    });
  } catch (error) {
    console.error("Error searching candidates by city:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while searching for candidates",
      details: error.message,
    });
  }
};

// Search candidates by keyword
exports.searchByKeyword = async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword) {
    return res.status(400).json({ message: 'Keyword is required.' });
  }

  try {
    const candidates = await CandidateProfile.findAll({
      where: {
        [Sequelize.Op.or]: [
          // CandidateProfile table columns
          /*Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), 'LIKE', `%${keyword.toLowerCase()}%`),*/
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('signin.name')), 'LIKE', '%100%'),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('signin.email')), 'LIKE', '%100%'),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('candidate_profile.phone')), 'LIKE', '%100%'),
          //Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phone')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('location')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('fresher_experience')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('availability_to_join')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('gender')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('marital_status')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('category')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('differently_abled')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('career_break')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('work_permit_to_usa')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('work_permit_to_country')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('permanent_address')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('home_town')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('language_proficiency')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('current_industry')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('department')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('desired_job_type')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('desired_employment_type')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('preferred_shift')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('preferred_work_location')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('resume_headline')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('summary')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('software_name')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('software_version')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('certification_name')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('work_title')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('work_sample_description')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('profile_summary')), 'LIKE', `%${keyword.toLowerCase()}%`),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('online_profile')), 'LIKE', `%${keyword.toLowerCase()}%`),

          // Projects table columns
          {
            '$keyskills.keyskillsname$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },

          // itSkills table columns
          {
            '$itSkills.itskills_name$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$itSkills.itskills_proficiency$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },

          {
            '$projects.project_title$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$projects.client$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$projects.project_status$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$projects.technology_used$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$projects.details_of_project$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },

          // Education table columns
          {
            '$education.education_level$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$education.university$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$education.course$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$education.specialization$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },

          // EmploymentDetails table columns
          {
            '$employmentdetails.current_employment$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.employment_type$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.current_company_name$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.current_job_title$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.skill_used$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.job_profile$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          },
          {
            '$employmentdetails.notice_period$': {
              [Sequelize.Op.like]: `%${keyword.toLowerCase()}%`,
            },
          }
        ],
      },
      include: [
        {
          model: Projects,
          required: false,
        },
        {
          model: Education,
          required: false,
        },
        {
          model: EmploymentDetails,
          required: false,
        },
        {
          model: keyskills, // Add keyskills model
          required: false,
          attributes: ['keyskills_id', 'keyskillsname']
        },
        {
          model: itSkills, // Add itSkills model
          required: false,
          attributes: ['itskills_id', 'itskills_name', 'itskills_proficiency']
        },
        {
          model: Signin,
          attributes: ['name', 'email'],
          required: true,
        }
      ],
    });

    if (candidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found for the given keyword.' });
    }

    const formattedCandidates = candidates.map((candidate) => candidate.get({ plain: true }));

    res.status(200).json({
      success: true,
      total_candidates: formattedCandidates.length,
      data: formattedCandidates
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching for candidates.' });
  }
};

// Search by Education Details
exports.searchCandidateByEducation = async (req, res) => {
  try {
    const {
      education_level,
      university,
      course,
      specialization,
      coursestart_year,
      courseend_year
    } = req.query;

    let whereClause = {};

    // Add conditions if parameters are provided
    if (education_level) {
      whereClause['education_level'] = { [Sequelize.Op.like]: `%${education_level}%` };
    }
    if (university) {
      whereClause['university'] = { [Sequelize.Op.like]: `%${university}%` };
    }
    if (course) {
      whereClause['course'] = { [Sequelize.Op.like]: `%${course}%` };
    }
    if (specialization) {
      whereClause['specialization'] = { [Sequelize.Op.like]: `%${specialization}%` };
    }
    if (coursestart_year) {
      whereClause['coursestart_year'] = coursestart_year;
    }
    if (courseend_year) {
      whereClause['courseend_year'] = courseend_year;
    }

    const candidates = await CandidateProfile.findAll({
      include: [{
        model: Education,
        where: whereClause,
        required: true
      }]
    });

    if (candidates.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No candidates found with specified education criteria' 
      });
    }

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching candidates by education',
      error: error.message 
    });
  }
};

// Search by Employment Details
exports.searchCandidateByEmployment = async (req, res) => {
  try {
    const {
      current_employment,
      employment_type,
      current_company_name,
      current_job_title,
      experience_in_year,
      notice_period,
      skill_used
    } = req.query;

    let whereClause = {};

    // Add conditions if parameters are provided
    if (current_employment) {
      whereClause['current_employment'] = current_employment;
    }
    if (employment_type) {
      whereClause['employment_type'] = { [Sequelize.Op.like]: `%${employment_type}%` };
    }
    if (current_company_name) {
      whereClause['current_company_name'] = { [Sequelize.Op.like]: `%${current_company_name}%` };
    }
    if (current_job_title) {
      whereClause['current_job_title'] = { [Sequelize.Op.like]: `%${current_job_title}%` };
    }
    if (experience_in_year) {
      whereClause['experience_in_year'] = experience_in_year;
    }
    if (notice_period) {
      whereClause['notice_period'] = { [Sequelize.Op.like]: `%${notice_period}%` };
    }
    if (skill_used) {
      whereClause['skill_used'] = { [Sequelize.Op.like]: `%${skill_used}%` };
    }

    const candidates = await CandidateProfile.findAll({
      include: [
        {
        model: EmploymentDetails,
        where: whereClause,
        required: true
      },
      {
        model: Signin,
        attributes: ['name', 'email'],
        required: true,
      }
    ]
    });

    if (candidates.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'No candidates found with specified employment criteria' 
      });
    }

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Error searching candidates by employment',
      error: error.message 
    });
  }
};


exports.searchCandidateByGender = async (req, res) => {
  try {
    const { gender } = req.query;
    
    if (!gender) {
      return res.status(400).json({
        success: false,
        message: 'Gender parameter is required'
      });
    }

    const candidates = await CandidateProfile.findAll({
      where: {
        gender: { [Sequelize.Op.like]: `%${gender}%` }
      },
      include: [
        { model: Education, required: false },
        { model: EmploymentDetails, required: false },
        { model: Projects, required: false },
        { model: itSkills, required: false },
        { model: keyskills, required: false },
        {
          model: Signin, // Include the Signin model
          attributes: ['name', 'email'], // Specify the fields you want to include
          required: true // Ensure that only candidates with signin data are returned
        }
      ]
    });

    if (candidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No candidates found'
      });
    }

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching candidates',
      error: error.message
    });
  }
};

exports.searchCandidateBySalary = async (req, res) => {
  try {
    const { min_salary, max_salary } = req.query;

    let whereClause = {};
    if (min_salary) {
      whereClause.current_salary = { [Sequelize.Op.gte]: min_salary };
    }
    if (max_salary) {
      whereClause.current_salary = { 
        ...whereClause.current_salary,
        [Sequelize.Op.lte]: max_salary 
      };
    }

    const candidates = await CandidateProfile.findAll({
      include: [
        {
        model: EmploymentDetails,
        where: whereClause,
        required: true
      },
      {
        model: Signin,
        attributes: ['name', 'email'],
        required: true,
      }
    ]
    });

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.searchCandidateByNoticePeriod = async (req, res) => {
  try {
    const { notice_period } = req.query;

    const candidates = await CandidateProfile.findAll({
      include: [
        {
        model: EmploymentDetails,
        where: {
          notice_period: { [Sequelize.Op.lte]: notice_period }
        },
        required: true
      },
      {
        model: Signin,
        attributes: ['name', 'email'],
        required: true,
      }
    ]
    });

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchCandidateByDisability = async (req, res) => {
  try {
    const { differently_abled } = req.query;

    const candidates = await CandidateProfile.findAll({
      where: {
        differently_abled: { [Sequelize.Op.like]: `%${differently_abled}%` }
      },
      include: [
        { model: Education, required: false },
        { model: EmploymentDetails, required: false },
        { model: Projects, required: false },
        { model: itSkills, required: false },
        { model: keyskills, required: false },
        {
          model: Signin, // Include the Signin model
          attributes: ['name', 'email'], // Specify the fields you want to include
          required: true // Ensure that only candidates with signin data are returned
        }
      ]
    });

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.searchCandidateByItSkills = async (req, res) => {
  try {
    const { skills } = req.query;

    if (!skills) {
      return res.status(400).json({
        success: false,
        message: 'Skills parameter is required',
      });
    }

    const candidates = await CandidateProfile.findAll({
      include: [
        { 
          model: Education, 
          required: false 
        },
        { 
          model: EmploymentDetails, 
          required: false 
        },
        { 
          model: Projects, 
          required: false 
        },
        {
          model: itSkills,  // Make sure this matches your model name
          required: true,
          where: {
            itskills_name: { [Sequelize.Op.like]: `%${skills}%` }
          }
        },
        {
          model: keyskills,  // Make sure this matches your model name
          required: false
        },
        {
          model: Signin,
          attributes: ['name', 'email'],
          required: true,
        }
      ],
      attributes: {
        include: [
          'candidate_id',
          'photo',
          'profile_last_updated',
          'location',
          'fresher_experience',
          'availability_to_join',
          'phone',
          'gender',
          'marital_status',
          'dob',
          'category',
          'differently_abled',
          'career_break',
          'work_permit_to_usa',
          'work_permit_to_country',
          'permanent_address',
          'home_town',
          'pin_code',
          'language_proficiency',
          'current_industry',
          'department',
          'desired_job_type',
          'desired_employment_type',
          'preferred_shift',
          'preferred_work_location',
          'expected_salary',
          'resume_headline',
          'resume',
          'summary',
          'software_name',
          'software_version',
          'certification_name',
          'certification_url',
          'work_title',
          'work_sample_url',
          'work_sample_description',
          'profile_summary',
          'online_profile',
          'work_sample',
          'white_paper',
          'presentation',
          'patent',
          'certification'
        ]
      }
    });

    if (candidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No candidates found with the given IT skills',
      });
    }

    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching candidates by IT skills',
      error: error.message,
    });
  }
};

exports.searchCandidateByExcludingKeyword = async (req, res) => {
  try {
    const { exclude } = req.query;

    if (!exclude) {
      return res.status(400).json({
        success: false,
        message: 'Exclude keyword is required',
      });
    }

    const candidates = await CandidateProfile.findAll({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('profile_summary')),
        {
          [Sequelize.Op.or]: [
            { [Sequelize.Op.notLike]: `%${exclude.toLowerCase()}%` },
            { [Sequelize.Op.is]: null }
          ]
        }
      ),
      include: [
        {
          model: Education,
          required: false
        },
        {
          model: EmploymentDetails,
          required: false
        },
        {
          model: Projects,
          required: false
        },
        {
          model: itSkills,
          required: false
        },
        {
          model: keyskills,
          required: false
        },
        {
          model: Signin,
          attributes: ['name', 'email'],
          required: true,
        }
      ]
    });

    // Filter results in JavaScript to handle NULL values and complex conditions
    const filteredCandidates = candidates.filter(candidate => {
      // Helper function to check if text contains exclude keyword
      const containsKeyword = (text) => 
        text && text.toLowerCase().includes(exclude.toLowerCase());

      // Check profile_summary
      if (containsKeyword(candidate.profile_summary)) return false;

      // Check Education
      if (candidate.Education && candidate.Education.some(edu => 
        containsKeyword(edu.course) || containsKeyword(edu.university)
      )) return false;

      // Check EmploymentDetails
      if (candidate.EmploymentDetails && candidate.EmploymentDetails.some(emp =>
        containsKeyword(emp.current_job_title) || containsKeyword(emp.current_company_name)
      )) return false;

      // Check Projects
      if (candidate.Projects && candidate.Projects.some(proj =>
        containsKeyword(proj.project_title) || containsKeyword(proj.details_of_project)
      )) return false;

      // Check ITSkills
      if (candidate.itSkills && candidate.itSkills.some(skill =>
        containsKeyword(skill.itskills_name)
      )) return false;

      // Check KeySkills
      if (candidate.keyskills && candidate.keyskills.some(skill =>
        containsKeyword(skill.keyskillsname)
      )) return false;

      return true;
    });

    if (filteredCandidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No candidates found after excluding the given keyword',
      });
    }

    res.status(200).json({
      success: true,
      total_candidates: filteredCandidates.length,
      data: filteredCandidates,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching candidates by excluding keyword',
      error: error.message,
    });
  }
};

exports.searchCandidateByActiveIn = async (req, res) => {
  try {
    // Extract 'days' from query
    const { days } = req.query;

    // Validate 'days' parameter (must be one of the dropdown values)
    const validDays = [1, 15, 30, 90, 180]; // 1 Day, 15 Days, 1 Month, 3 Months, 6 Months
    if (!validDays.includes(parseInt(days))) {
      return res.status(400).json({
        success: false,
        message: `Invalid 'days' parameter. Allowed values: ${validDays.join(", ")}`,
      });
    }

    // Calculate the active date range
    const activeDate = new Date();
    activeDate.setDate(activeDate.getDate() - parseInt(days));

    // Fetch candidates whose 'profile_last_updated' is >= activeDate
    const candidates = await CandidateProfile.findAll({
      where: {
        profile_last_updated: {
          [Sequelize.Op.gte]: activeDate, // Greater than or equal to activeDate
        },
      },
      include: [
        { model: Education, required: false },
        { model: EmploymentDetails, required: false },
        { model: Projects, required: false },
        {model: keyskills, required: false},
        {model: itSkills, required: false},
        {
          model: Signin, // Include the Signin model
          attributes: ['name', 'email'], // Specify the fields you want to include
          required: true // Ensure that only candidates with signin data are returned
        }
      ],
    });

    // Return the result
    res.status(200).json({
      success: true,
      total_candidates: candidates.length,
      data: candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching candidates by active status',
      error: error.message,
    });
  }
};



exports.searchCandidates = async (req, res) => {
  try {
    const {
      min_experience,
      max_experience,
      location,
      education_level,
      university,
      course,
      specialization,
      coursestart_year,
      courseend_year,
      current_employment,
      employment_type,
      current_company_name,
      current_job_title,
      notice_period,
      min_salary,
      max_salary,
      gender,
      differently_abled,
      skills,
      keyword,
      exclude_keyword,
      active_days
    } = req.query;

    let whereClause = {};
    let employmentWhereClause = {};
    let educationWhereClause = {};
    let itSkillsWhereClause = {};

    if (min_experience || max_experience) {
      employmentWhereClause.experience_in_year = {};
      if (min_experience) employmentWhereClause.experience_in_year[Op.gte] = parseFloat(min_experience);
      if (max_experience) employmentWhereClause.experience_in_year[Op.lte] = parseFloat(max_experience);
    }

    if (location) whereClause.location = { [Op.like]: `%${location}%` };

    if (education_level) educationWhereClause.education_level = { [Op.like]: `%${education_level}%` };
    if (university) educationWhereClause.university = { [Op.like]: `%${university}%` };
    if (course) educationWhereClause.course = { [Op.like]: `%${course}%` };
    if (specialization) educationWhereClause.specialization = { [Op.like]: `%${specialization}%` };
    if (coursestart_year) educationWhereClause.coursestart_year = coursestart_year;
    if (courseend_year) educationWhereClause.courseend_year = courseend_year;

    if (current_employment) employmentWhereClause.current_employment = current_employment;
    if (employment_type) employmentWhereClause.employment_type = { [Op.like]: `%${employment_type}%` };
    if (current_company_name) employmentWhereClause.current_company_name = { [Op.like]: `%${current_company_name}%` };
    if (current_job_title) employmentWhereClause.current_job_title = { [Op.like]: `%${current_job_title}%` };
    if (notice_period) employmentWhereClause.notice_period = { [Op.like]: `%${notice_period}%` };

    if (min_salary || max_salary) {
      employmentWhereClause.current_salary = {};
      if (min_salary) employmentWhereClause.current_salary[Op.gte] = parseFloat(min_salary);
      if (max_salary) employmentWhereClause.current_salary[Op.lte] = parseFloat(max_salary);
    }

    if (gender) whereClause.gender = { [Op.like]: `%${gender}%` };
    if (differently_abled) whereClause.differently_abled = { [Op.like]: `%${differently_abled}%` };
    if (skills) itSkillsWhereClause.itskills_name = { [Op.like]: `%${skills}%` };

    if (active_days) {
      const activeDate = new Date();
      activeDate.setDate(activeDate.getDate() - parseInt(active_days));
      whereClause.profile_last_updated = { [Op.gte]: activeDate };
    }

    if (keyword) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { phone: { [Op.like]: `%${keyword}%` } },
        { location: { [Op.like]: `%${keyword}%` } },
        { resume_headline: { [Op.like]: `%${keyword}%` } },
        { profile_summary: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (exclude_keyword) {
      whereClause.profile_summary = {
        [Op.or]: [
          { [Op.notLike]: `%${exclude_keyword}%` },
          { [Op.is]: null }
        ]
      };
    }

    const candidates = await CandidateProfile.findAll({
      where: whereClause,
      include: [
        {
          model: EmploymentDetails,
          where: Object.keys(employmentWhereClause).length > 0 ? employmentWhereClause : undefined,
          required: Object.keys(employmentWhereClause).length > 0
        },
        {
          model: Education,
          where: Object.keys(educationWhereClause).length > 0 ? educationWhereClause : undefined,
          required: Object.keys(educationWhereClause).length > 0
        },
        {
          model: Projects,
          required: false
        },
        {
          model: itSkills,
          where: Object.keys(itSkillsWhereClause).length > 0 ? itSkillsWhereClause : undefined,
          required: Object.keys(itSkillsWhereClause).length > 0
        },
        {
          model: keyskills,
          required: false
        },
        {
          model: Signin,
          attributes: ['name', 'email'],
          required: true
        }
      ],
      distinct: true
    });

    // 🔥 **Calculate Total Experience**
    const formattedCandidates = candidates.map(candidate => {
      let totalYears = 0;
      let totalMonths = 0;

      if (candidate.EmploymentDetails && candidate.EmploymentDetails.length > 0) {
        candidate.EmploymentDetails.forEach(emp => {
          totalYears += emp.experience_in_year || 0;
          totalMonths += emp.experience_in_months || 0;
        });

        // Convert months into years
        totalYears += Math.floor(totalMonths / 12);
        totalMonths = totalMonths % 12;
      }

      return {
        ...candidate.toJSON(),
        total_experience: `${totalYears} years ${totalMonths} months`
      };
    });

    res.status(200).json({
      success: true,
      total_candidates: formattedCandidates.length,
      data: formattedCandidates
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching candidates',
      error: error.message
    });
  }
};
