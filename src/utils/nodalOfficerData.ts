import { NodalOfficerInfo } from '../types';

export const getNodalOfficerForGrievance = (
  ministry?: string,
  category?: string,
  location?: string
): NodalOfficerInfo => {
  const ministryLower = (ministry || '').toLowerCase();
  const categoryLower = (category || '').toLowerCase();

  if (
    ministryLower.includes('home') ||
    ministryLower.includes('ndma') ||
    categoryLower.includes('disaster') ||
    categoryLower.includes('flood')
  ) {
    return {
      name: 'Shri Rajesh Sharma, IRPS',
      designation: 'Nodal Public Grievance Officer & Director (DM)',
      department: 'Disaster Management Division & Redressal Cell, Ministry of Home Affairs',
      subDivision: 'NDMA Crisis Cell & Regional Rapid Action Command',
      contactNumber: '+91-11-2309 3054 / +91-11-2343 8252',
      email: 'nodal-dm@mha.gov.in',
      officeAddress: 'Block 3, CGO Complex, Lodhi Road, New Delhi - 110003',
    };
  }

  if (
    ministryLower.includes('urban') ||
    ministryLower.includes('housing') ||
    categoryLower.includes('drainage') ||
    categoryLower.includes('sanitation')
  ) {
    return {
      name: 'Smt. Ananya Deshmukh, IAS',
      designation: 'Chief Nodal Grievance Officer & Joint Secretary',
      department: 'Urban Infrastructure & Public Sanitation Redressal Wing, MoHUA',
      subDivision: 'Swachh Bharat & Smart Cities Rapid Redressal Cell',
      contactNumber: '+91-11-2306 1425 / +91-22-2644 4780',
      email: 'nodal-mohua@gov.in',
      officeAddress: 'Room 204-C, Nirman Bhawan, Maulana Azad Road, New Delhi - 110011',
    };
  }

  if (
    ministryLower.includes('road') ||
    ministryLower.includes('transport') ||
    ministryLower.includes('highway') ||
    categoryLower.includes('highway') ||
    categoryLower.includes('bridge')
  ) {
    return {
      name: 'Shri Vikramaditya Verma, CE (Civil)',
      designation: 'Superintending Engineer & Regional Nodal Officer',
      department: 'Highway Safety, Landslide Clearance & Disaster Recovery Cell, MoRTH',
      subDivision: 'NHAI Regional Office Command Hub - Western Zone',
      contactNumber: '+91-11-2507 4100 / +91-20-2553 8200',
      email: 'nodal-nhai@nic.in',
      officeAddress: 'G-5 & 6, Sector-10, Dwarka, New Delhi - 110075 / Western Hub',
    };
  }

  if (
    ministryLower.includes('labour') ||
    ministryLower.includes('employment') ||
    categoryLower.includes('epfo') ||
    categoryLower.includes('pf')
  ) {
    return {
      name: 'Dr. K. Srinivas Rao, RPFC-I',
      designation: 'Regional Provident Fund Commissioner & Public Grievance Officer',
      department: 'EPFO Grievance Redressal & Pension Services Division',
      subDivision: 'EPFO Zonal Headquarters & Citizen Facilitation Center',
      contactNumber: '+91-11-2617 2668 / +91-863-223 4567',
      email: 'epfo-nodal@epfindia.gov.in',
      officeAddress: 'Bhavishya Nidhi Bhawan, 14, Bhikaiji Cama Place, New Delhi - 110066',
    };
  }

  if (
    ministryLower.includes('health') ||
    categoryLower.includes('health') ||
    categoryLower.includes('medical')
  ) {
    return {
      name: 'Dr. Meenakshi Sundaram, MBBS, MD',
      designation: 'Nodal Director (Emergency Medical Response)',
      department: 'Public Health Emergency & Epidemic Prevention Directorate, MoHFW',
      subDivision: 'National Health Mission Crisis Cell',
      contactNumber: '+91-11-2306 1806 / +91-11-2306 3221',
      email: 'nodal-health@mohfw.gov.in',
      officeAddress: 'Nirman Bhawan, Rajpath Area, Central Secretariat, New Delhi - 110011',
    };
  }

  // Fallback
  return {
    name: 'Shri Sunil K. Mehta, Nodal PG Officer',
    designation: 'Central Nodal Grievance Redressal Officer',
    department: 'Department of Administrative Reforms and Public Grievances (DARPG)',
    subDivision: 'CPGRAMS Central Redressal Division',
    contactNumber: '+91-11-2374 2143',
    email: 'pg-nodal@darpg.nic.in',
    officeAddress: '5th Floor, Sardar Patel Bhawan, Sansad Marg, New Delhi - 110001',
  };
};
