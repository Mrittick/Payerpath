/* Analytics → Remittances — stub row data
   Swap this import for an API service call once the backend is wired. */

import type { DataTableRow } from '@merces/components/display/data-table/data-table/data-table.types';

export interface SeriesDef {
  id: string;
  label: string;
  colorToken: string;
}

export const CHART_SERIES_DEFS: SeriesDef[] = [
  { id: '01', label: 'Total Claims', colorToken: 'var(--colour-stroke-chart-01)' },
  { id: '02', label: 'To be Paid in 0d - 30d', colorToken: 'var(--colour-stroke-chart-02)' },
  { id: '03', label: 'To be Paid in 31d - 60d', colorToken: 'var(--colour-stroke-chart-03)' },
  { id: '04', label: 'To be Paid in 61d - 90d', colorToken: 'var(--colour-stroke-chart-04)' },
  { id: '05', label: 'To be Paid in 91d - 120d', colorToken: 'var(--colour-stroke-chart-05)' },
  { id: '06', label: 'To be Paid in 120d +', colorToken: 'var(--colour-stroke-chart-06)' }
];

export const REMITTANCES_RECORDS: DataTableRow[] = [
  { id: 'bp-0', billingProvider: '1793872865', totalClaimCount: '20,098', days0to30: '11,321', days31to60: '4,817', days61to90: '2,187', days91to120: '1,117', days120plus: '656' },
  { id: 'bp-1', billingProvider: '1571093050', totalClaimCount: '28,132', days0to30: '18,427', days31to60: '7,336', days61to90: '1,049', days91to120: '538', days120plus: '782' },
  { id: 'bp-2', billingProvider: '1532718183', totalClaimCount: '14,017', days0to30: '8,727', days31to60: '3,560', days61to90: '777', days91to120: '936', days120plus: '17' },
  { id: 'bp-3', billingProvider: '1730932805', totalClaimCount: '8,442', days0to30: '3,571', days31to60: '2,854', days61to90: '284', days91to120: '904', days120plus: '829' },
  { id: 'bp-4', billingProvider: '1088074766', totalClaimCount: '25,337', days0to30: '9,506', days31to60: '13,428', days61to90: '723', days91to120: '767', days120plus: '913' },
  { id: 'bp-5', billingProvider: '1592649353', totalClaimCount: '29,076', days0to30: '20,121', days31to60: '3,634', days61to90: '4,609', days91to120: '141', days120plus: '571' },
  { id: 'bp-6', billingProvider: '1788332139', totalClaimCount: '18,677', days0to30: '822', days31to60: '12,555', days61to90: '3,478', days91to120: '1,101', days120plus: '721' },
  { id: 'bp-7', billingProvider: '1380666891', totalClaimCount: '19,003', days0to30: '10,218', days31to60: '6,491', days61to90: '666', days91to120: '1,170', days120plus: '458' },
  { id: 'bp-8', billingProvider: '1265095190', totalClaimCount: '27,591', days0to30: '17,584', days31to60: '7,882', days61to90: '986', days91to120: '530', days120plus: '609' },
  { id: 'bp-9', billingProvider: '1402867167', totalClaimCount: '38,185', days0to30: '20,303', days31to60: '12,505', days61to90: '2,681', days91to120: '1,839', days120plus: '857' },
  { id: 'bp-10', billingProvider: '1791746137', totalClaimCount: '16,110', days0to30: '4,105', days31to60: '6,843', days61to90: '3,577', days91to120: '1,290', days120plus: '295' },
  { id: 'bp-11', billingProvider: '1341562476', totalClaimCount: '28,847', days0to30: '12,314', days31to60: '10,491', days61to90: '3,971', days91to120: '1,937', days120plus: '134' },
  { id: 'bp-12', billingProvider: '1626081044', totalClaimCount: '15,310', days0to30: '4,658', days31to60: '5,988', days61to90: '3,657', days91to120: '33', days120plus: '974' },
  { id: 'bp-13', billingProvider: '1541920836', totalClaimCount: '13,417', days0to30: '3,866', days31to60: '5,232', days61to90: '3,191', days91to120: '283', days120plus: '845' },
  { id: 'bp-14', billingProvider: '1753100542', totalClaimCount: '37,389', days0to30: '23,499', days31to60: '6,321', days61to90: '4,957', days91to120: '1,926', days120plus: '686' },
  { id: 'bp-15', billingProvider: '1220620320', totalClaimCount: '13,266', days0to30: '6,675', days31to60: '2,747', days61to90: '2,058', days91to120: '1,020', days120plus: '766' },
  { id: 'bp-16', billingProvider: '1457993889', totalClaimCount: '30,118', days0to30: '13,874', days31to60: '12,823', days61to90: '2,556', days91to120: '712', days120plus: '153' },
  { id: 'bp-17', billingProvider: '1159764806', totalClaimCount: '20,817', days0to30: '10,925', days31to60: '6,081', days61to90: '2,461', days91to120: '1,188', days120plus: '162' },
  { id: 'bp-18', billingProvider: '1149432253', totalClaimCount: '22,710', days0to30: '9,149', days31to60: '11,480', days61to90: '84', days91to120: '1,398', days120plus: '599' },
  { id: 'bp-19', billingProvider: '1943270189', totalClaimCount: '25,782', days0to30: '17,413', days31to60: '5,684', days61to90: '2,340', days91to120: '235', days120plus: '110' },
  { id: 'bp-20', billingProvider: '1419962693', totalClaimCount: '14,909', days0to30: '1,226', days31to60: '9,317', days61to90: '3,980', days91to120: '38', days120plus: '348' },
  { id: 'bp-21', billingProvider: '1851513924', totalClaimCount: '25,870', days0to30: '8,881', days31to60: '14,297', days61to90: '1,484', days91to120: '490', days120plus: '718' },
  { id: 'bp-22', billingProvider: '1833590431', totalClaimCount: '33,469', days0to30: '21,306', days31to60: '6,430', days61to90: '4,815', days91to120: '831', days120plus: '87' },
  { id: 'bp-23', billingProvider: '1883405639', totalClaimCount: '33,774', days0to30: '19,962', days31to60: '11,000', days61to90: '754', days91to120: '1,422', days120plus: '636' },
  { id: 'bp-24', billingProvider: '1634091938', totalClaimCount: '27,749', days0to30: '16,492', days31to60: '8,357', days61to90: '1,409', days91to120: '528', days120plus: '963' },
  { id: 'bp-25', billingProvider: '1595942637', totalClaimCount: '36,930', days0to30: '16,902', days31to60: '14,451', days61to90: '3,091', days91to120: '1,822', days120plus: '664' },
  { id: 'bp-26', billingProvider: '1080706398', totalClaimCount: '27,944', days0to30: '18,181', days31to60: '6,832', days61to90: '1,213', days91to120: '1,152', days120plus: '566' },
  { id: 'bp-27', billingProvider: '1218488956', totalClaimCount: '14,561', days0to30: '5,434', days31to60: '3,686', days61to90: '4,266', days91to120: '296', days120plus: '879' },
  { id: 'bp-28', billingProvider: '1221219896', totalClaimCount: '27,353', days0to30: '21,153', days31to60: '2,349', days61to90: '1,729', days91to120: '1,197', days120plus: '925' },
  { id: 'bp-29', billingProvider: '1679585200', totalClaimCount: '13,644', days0to30: '4,075', days31to60: '3,658', days61to90: '4,509', days91to120: '1,285', days120plus: '117' },
  { id: 'bp-30', billingProvider: '1270945429', totalClaimCount: '8,595', days0to30: '2,630', days31to60: '3,786', days61to90: '1,008', days91to120: '826', days120plus: '345' },
  { id: 'bp-31', billingProvider: '1734259669', totalClaimCount: '21,785', days0to30: '11,324', days31to60: '5,908', days61to90: '3,438', days91to120: '929', days120plus: '186' },
  { id: 'bp-32', billingProvider: '1564808195', totalClaimCount: '34,001', days0to30: '20,938', days31to60: '10,336', days61to90: '1,912', days91to120: '802', days120plus: '13' },
  { id: 'bp-33', billingProvider: '1651947946', totalClaimCount: '20,248', days0to30: '9,566', days31to60: '6,317', days61to90: '2,757', days91to120: '909', days120plus: '699' },
  { id: 'bp-34', billingProvider: '1361208630', totalClaimCount: '21,571', days0to30: '7,626', days31to60: '9,989', days61to90: '2,007', days91to120: '1,589', days120plus: '360' },
  { id: 'bp-35', billingProvider: '1297801119', totalClaimCount: '11,898', days0to30: '5,190', days31to60: '3,595', days61to90: '1,150', days91to120: '1,925', days120plus: '38' },
  { id: 'bp-36', billingProvider: '1682751097', totalClaimCount: '32,310', days0to30: '19,052', days31to60: '7,034', days61to90: '4,215', days91to120: '1,961', days120plus: '48' },
  { id: 'bp-37', billingProvider: '1021809452', totalClaimCount: '39,531', days0to30: '24,505', days31to60: '10,091', days61to90: '4,292', days91to120: '566', days120plus: '77' },
  { id: 'bp-38', billingProvider: '1074031506', totalClaimCount: '8,716', days0to30: '6,517', days31to60: '1,170', days61to90: '562', days91to120: '200', days120plus: '267' },
  { id: 'bp-39', billingProvider: '1424963020', totalClaimCount: '21,999', days0to30: '12,246', days31to60: '5,315', days61to90: '2,501', days91to120: '1,537', days120plus: '400' },
  { id: 'bp-40', billingProvider: '1780848311', totalClaimCount: '39,978', days0to30: '21,120', days31to60: '14,771', days61to90: '1,797', days91to120: '1,731', days120plus: '559' },
  { id: 'bp-41', billingProvider: '1428540259', totalClaimCount: '29,477', days0to30: '13,517', days31to60: '13,096', days61to90: '1,961', days91to120: '804', days120plus: '99' },
  { id: 'bp-42', billingProvider: '1782556261', totalClaimCount: '12,983', days0to30: '7,670', days31to60: '1,620', days61to90: '1,952', days91to120: '1,546', days120plus: '195' },
  { id: 'bp-43', billingProvider: '1945243718', totalClaimCount: '37,100', days0to30: '23,849', days31to60: '9,887', days61to90: '1,128', days91to120: '1,487', days120plus: '749' },
  { id: 'bp-44', billingProvider: '1869072183', totalClaimCount: '20,169', days0to30: '12,895', days31to60: '3,149', days61to90: '1,891', days91to120: '1,927', days120plus: '307' },
  { id: 'bp-45', billingProvider: '1348390564', totalClaimCount: '9,934', days0to30: '6,860', days31to60: '1,837', days61to90: '258', days91to120: '73', days120plus: '906' },
  { id: 'bp-46', billingProvider: '1749094404', totalClaimCount: '25,793', days0to30: '5,804', days31to60: '13,140', days61to90: '4,375', days91to120: '1,867', days120plus: '607' },
  { id: 'bp-47', billingProvider: '1849022707', totalClaimCount: '22,595', days0to30: '13,273', days31to60: '3,820', days61to90: '3,318', days91to120: '1,655', days120plus: '529' },
  { id: 'bp-48', billingProvider: '1790080502', totalClaimCount: '13,275', days0to30: '4,206', days31to60: '7,612', days61to90: '591', days91to120: '127', days120plus: '739' },
  { id: 'bp-49', billingProvider: '1904231463', totalClaimCount: '25,168', days0to30: '17,597', days31to60: '5,960', days61to90: '891', days91to120: '701', days120plus: '19' },
  { id: 'bp-50', billingProvider: '1409397746', totalClaimCount: '12,907', days0to30: '4,263', days31to60: '5,695', days61to90: '2,688', days91to120: '131', days120plus: '130' },
  { id: 'bp-51', billingProvider: '1813892469', totalClaimCount: '25,473', days0to30: '18,664', days31to60: '3,987', days61to90: '2,738', days91to120: '62', days120plus: '22' },
  { id: 'bp-52', billingProvider: '1124945416', totalClaimCount: '24,502', days0to30: '12,084', days31to60: '9,884', days61to90: '362', days91to120: '1,675', days120plus: '497' },
  { id: 'bp-53', billingProvider: '1583905128', totalClaimCount: '29,672', days0to30: '14,136', days31to60: '8,454', days61to90: '4,765', days91to120: '1,813', days120plus: '504' },
  { id: 'bp-54', billingProvider: '1259800334', totalClaimCount: '16,206', days0to30: '13,250', days31to60: '1,833', days61to90: '777', days91to120: '278', days120plus: '68' },
  { id: 'bp-55', billingProvider: '1347228695', totalClaimCount: '31,569', days0to30: '24,442', days31to60: '861', days61to90: '4,320', days91to120: '1,706', days120plus: '240' },
  { id: 'bp-56', billingProvider: '1302480777', totalClaimCount: '30,077', days0to30: '15,804', days31to60: '10,799', days61to90: '2,499', days91to120: '938', days120plus: '37' },
  { id: 'bp-57', billingProvider: '1866654834', totalClaimCount: '21,776', days0to30: '13,186', days31to60: '7,197', days61to90: '649', days91to120: '560', days120plus: '184' },
  { id: 'bp-58', billingProvider: '1662405461', totalClaimCount: '28,704', days0to30: '13,750', days31to60: '13,382', days61to90: '326', days91to120: '329', days120plus: '917' },
  { id: 'bp-59', billingProvider: '1662663151', totalClaimCount: '17,988', days0to30: '13,685', days31to60: '1,248', days61to90: '778', days91to120: '1,397', days120plus: '880' },
  { id: 'bp-60', billingProvider: '1850524728', totalClaimCount: '20,042', days0to30: '11,731', days31to60: '3,087', days61to90: '3,553', days91to120: '1,495', days120plus: '176' },
  { id: 'bp-61', billingProvider: '1087745131', totalClaimCount: '19,812', days0to30: '15,898', days31to60: '841', days61to90: '1,428', days91to120: '1,191', days120plus: '454' },
  { id: 'bp-62', billingProvider: '1741777100', totalClaimCount: '11,845', days0to30: '1,984', days31to60: '5,342', days61to90: '3,316', days91to120: '848', days120plus: '355' },
  { id: 'bp-63', billingProvider: '1290170608', totalClaimCount: '35,375', days0to30: '18,767', days31to60: '12,458', days61to90: '2,814', days91to120: '542', days120plus: '794' },
  { id: 'bp-64', billingProvider: '1835142468', totalClaimCount: '18,774', days0to30: '1,185', days31to60: '11,899', days61to90: '3,967', days91to120: '1,084', days120plus: '639' },
  { id: 'bp-65', billingProvider: '1520320138', totalClaimCount: '20,674', days0to30: '13,081', days31to60: '2,455', days61to90: '4,037', days91to120: '1,024', days120plus: '77' },
  { id: 'bp-66', billingProvider: '1029711912', totalClaimCount: '24,468', days0to30: '15,221', days31to60: '2,822', days61to90: '3,999', days91to120: '1,782', days120plus: '644' },
  { id: 'bp-67', billingProvider: '1083851973', totalClaimCount: '21,058', days0to30: '9,732', days31to60: '7,049', days61to90: '3,462', days91to120: '79', days120plus: '736' },
  { id: 'bp-68', billingProvider: '1102991065', totalClaimCount: '34,604', days0to30: '18,371', days31to60: '11,870', days61to90: '2,996', days91to120: '519', days120plus: '848' },
  { id: 'bp-69', billingProvider: '1768425509', totalClaimCount: '22,024', days0to30: '12,402', days31to60: '4,725', days61to90: '4,107', days91to120: '508', days120plus: '282' },
  { id: 'bp-70', billingProvider: '1129446644', totalClaimCount: '43,399', days0to30: '22,538', days31to60: '14,084', days61to90: '4,656', days91to120: '1,605', days120plus: '516' },
  { id: 'bp-71', billingProvider: '1231698923', totalClaimCount: '12,602', days0to30: '1,435', days31to60: '5,936', days61to90: '4,166', days91to120: '508', days120plus: '557' },
  { id: 'bp-72', billingProvider: '1133428326', totalClaimCount: '34,112', days0to30: '15,402', days31to60: '12,632', days61to90: '4,353', days91to120: '1,054', days120plus: '671' },
  { id: 'bp-73', billingProvider: '1612618886', totalClaimCount: '22,707', days0to30: '19,512', days31to60: '636', days61to90: '1,937', days91to120: '191', days120plus: '431' },
  { id: 'bp-74', billingProvider: '1179604811', totalClaimCount: '12,114', days0to30: '1,022', days31to60: '6,801', days61to90: '2,753', days91to120: '1,488', days120plus: '50' },
  { id: 'bp-75', billingProvider: '1104669768', totalClaimCount: '10,218', days0to30: '2,517', days31to60: '4,591', days61to90: '1,059', days91to120: '1,418', days120plus: '633' },
  { id: 'bp-76', billingProvider: '1577304901', totalClaimCount: '28,201', days0to30: '14,017', days31to60: '11,207', days61to90: '929', days91to120: '1,522', days120plus: '526' },
  { id: 'bp-77', billingProvider: '1289909965', totalClaimCount: '34,176', days0to30: '21,496', days31to60: '7,120', days61to90: '4,556', days91to120: '784', days120plus: '220' },
  { id: 'bp-78', billingProvider: '1898306217', totalClaimCount: '17,655', days0to30: '1,758', days31to60: '10,263', days61to90: '3,758', days91to120: '1,484', days120plus: '392' },
  { id: 'bp-79', billingProvider: '1684070642', totalClaimCount: '27,419', days0to30: '20,661', days31to60: '463', days61to90: '4,546', days91to120: '848', days120plus: '901' },
  { id: 'bp-80', billingProvider: '1074077319', totalClaimCount: '33,035', days0to30: '24,665', days31to60: '2,767', days61to90: '3,833', days91to120: '1,701', days120plus: '69' },
  { id: 'bp-81', billingProvider: '1111276725', totalClaimCount: '15,214', days0to30: '12,982', days31to60: '719', days61to90: '720', days91to120: '48', days120plus: '745' },
  { id: 'bp-82', billingProvider: '1675244817', totalClaimCount: '30,465', days0to30: '12,984', days31to60: '12,370', days61to90: '4,745', days91to120: '335', days120plus: '31' },
  { id: 'bp-83', billingProvider: '1804086438', totalClaimCount: '9,072', days0to30: '1,664', days31to60: '5,444', days61to90: '1,357', days91to120: '81', days120plus: '526' },
  { id: 'bp-84', billingProvider: '1387004606', totalClaimCount: '28,759', days0to30: '8,613', days31to60: '14,537', days61to90: '4,570', days91to120: '570', days120plus: '469' },
  { id: 'bp-85', billingProvider: '1833572970', totalClaimCount: '28,592', days0to30: '19,856', days31to60: '5,219', days61to90: '2,321', days91to120: '235', days120plus: '961' },
  { id: 'bp-86', billingProvider: '1521367482', totalClaimCount: '19,502', days0to30: '12,402', days31to60: '2,418', days61to90: '3,865', days91to120: '108', days120plus: '709' },
  { id: 'bp-87', billingProvider: '1980425984', totalClaimCount: '31,798', days0to30: '12,217', days31to60: '14,442', days61to90: '2,837', days91to120: '1,755', days120plus: '547' },
  { id: 'bp-88', billingProvider: '1110373433', totalClaimCount: '20,274', days0to30: '4,563', days31to60: '10,886', days61to90: '3,595', days91to120: '1,069', days120plus: '161' },
  { id: 'bp-89', billingProvider: '1899535331', totalClaimCount: '27,043', days0to30: '18,196', days31to60: '3,203', days61to90: '4,057', days91to120: '1,314', days120plus: '273' },
  { id: 'bp-90', billingProvider: '1861594461', totalClaimCount: '16,480', days0to30: '13,029', days31to60: '724', days61to90: '1,564', days91to120: '419', days120plus: '744' },
  { id: 'bp-91', billingProvider: '1009409372', totalClaimCount: '12,384', days0to30: '6,242', days31to60: '3,054', days61to90: '1,055', days91to120: '1,162', days120plus: '871' },
  { id: 'bp-92', billingProvider: '1017531669', totalClaimCount: '14,049', days0to30: '2,821', days31to60: '7,703', days61to90: '1,517', days91to120: '1,233', days120plus: '775' },
  { id: 'bp-93', billingProvider: '1448868889', totalClaimCount: '34,573', days0to30: '23,937', days31to60: '7,038', days61to90: '2,502', days91to120: '1,026', days120plus: '70' },
  { id: 'bp-94', billingProvider: '1090338292', totalClaimCount: '16,107', days0to30: '14,570', days31to60: '255', days61to90: '20', days91to120: '368', days120plus: '894' },
  { id: 'bp-95', billingProvider: '1938783792', totalClaimCount: '18,634', days0to30: '961', days31to60: '14,296', days61to90: '2,435', days91to120: '382', days120plus: '560' },
  { id: 'bp-96', billingProvider: '1259576499', totalClaimCount: '16,257', days0to30: '11,461', days31to60: '1,629', days61to90: '1,541', days91to120: '1,076', days120plus: '550' },
  { id: 'bp-97', billingProvider: '1956880562', totalClaimCount: '35,935', days0to30: '20,256', days31to60: '13,154', days61to90: '614', days91to120: '1,348', days120plus: '563' },
  { id: 'bp-98', billingProvider: '1912540773', totalClaimCount: '24,592', days0to30: '11,230', days31to60: '8,161', days61to90: '3,998', days91to120: '940', days120plus: '263' },
  { id: 'bp-99', billingProvider: '1546774350', totalClaimCount: '14,862', days0to30: '4,809', days31to60: '7,663', days61to90: '776', days91to120: '745', days120plus: '869' }
];

// All records mapped to chart groups — full parity with the data table
export interface ChartGroup {
  groupId: string;
  seriesValues: Record<string, number>;
}

export const CHART_GROUPS: ChartGroup[] = REMITTANCES_RECORDS.map(row => ({
  groupId: String(row['billingProvider']),
  seriesValues: {
    '01': Number(String(row['totalClaimCount']).replace(/,/g, '')),
    '02': Number(String(row['days0to30']).replace(/,/g, '')),
    '03': Number(String(row['days31to60']).replace(/,/g, '')),
    '04': Number(String(row['days61to90']).replace(/,/g, '')),
    '05': Number(String(row['days91to120']).replace(/,/g, '')),
    '06': Number(String(row['days120plus']).replace(/,/g, ''))
  }
}));
