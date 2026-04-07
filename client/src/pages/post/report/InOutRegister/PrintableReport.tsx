/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';

interface PrintableReportProps {
  data: any[];
  totalsum: { firm_id: number; firm_name: string; total_qty: number; total_charges: number }[];
  inputs: {
    fromdate: string;
    todate: string;
  };
  loading: boolean;
}

const PrintableReport: React.FC<PrintableReportProps> = ({ data, inputs, totalsum, loading }) => {
  const { post_name } = useSelector((state: RootState) => state.postentry);
  const groupedData = data?.reduce((acc: { [key: number]: any[] }, item) => {
    if (!acc[item.firm_id]) {
      acc[item.firm_id] = [];
    }
    acc[item.firm_id].push(item);
    return acc;
  }, {});

  const firmNames: { [key: number]: string } = {};
  data?.forEach(item => {
    if (!firmNames[item.firm_id]) {
      firmNames[item.firm_id] = item.firm_name;
    }
  });

  const Header = ({ firmName }: { firmName: string }) => (
    <>
      <h1 className="sm:text-lg font-bold text-center">
        Malpani Group, Sangmaner
      </h1>
      <h2 className="text-xs sm:text-sm mb-4 text-center">
        Register For Period From {moment(inputs.fromdate).format('DD/MM/YYYY')} To{' '}
        {moment(inputs.todate).format('DD/MM/YYYY')}
      </h2>
      <div className="flex flex-col justify-start font-semibold text-md mb-4">
        <div>Firm Name: {firmName}</div>
        {post_name && <div>Post Type: {post_name ? post_name : '[All]'}</div>}
      </div>
      <hr className="border-dashed font-extrabold bg-slate-950 dark:bg-slate-100 mb-4" />
    </>
  );

  return loading ? (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-4 text-blue-600 font-medium">Loading...</span>
    </div>
  ) : (
    <div className="printable-content sm:p-4 sm:mr-3">
      {Object.keys(groupedData).map((firmIdStr, index) => {
        const firmId = parseInt(firmIdStr, 10);
        const firmData = groupedData[firmId];
        const firmName = firmNames[firmId] || 'Unknown Firm';
        const firmTotals = totalsum.find(sum => sum.firm_id === firmId);

        return (
          <div key={index} className="firm-section">
            <Header firmName={firmName} />
            <div className="overflow-x-auto w-full">
              <table className="min-w-full border-collapse border border-slate-300 mb-4">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr className="font-semibold">
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-24">Date & Rec.No.</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-20">Department</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-32">To</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-24">City Name</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-12">QTY</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-12">Amt</th>
                    <th className="border border-slate-300 px-1 py-2 bg-slate-100 dark:bg-slate-700 w-40">Remark</th>
                    <th className="border border-slate-300 px-1 py-2 hidden">Rec. Date</th>
                  </tr>
                </thead>
                <tbody>
                  {firmData?.map((item: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-24 break-words">
                        {moment(item?.entry_date).format('DD/MM/YYYY')} - {item?.receipt_no}
                      </td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-20 break-words">{item?.dept_name}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-32 break-words">{item?.party_name}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-24 break-words">{item?.city_name}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-12 text-center">{item?.qty}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-12 text-right">{item?.charges}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 w-40 break-words">{item?.remark}</td>
                      <td className="text-xs border border-slate-300 px-1 py-2 hidden">
                        {item?.rec_date && moment(item?.rec_date).format('DD/MM/YYYY')}
                      </td>
                    </tr>
                  ))}

                  {firmTotals && (
                    <tr className="font-semibold bg-slate-100 dark:bg-slate-600">
                      <td colSpan={4} className="border border-slate-300 p-2 text-right">
                        {`Total [${firmTotals?.firm_name}]`}
                      </td>
                      <td className="border border-slate-300 p-2 w-16 text-center">{firmTotals?.total_qty}</td>
                      <td className="border border-slate-300 p-2 w-20 text-right">{firmTotals?.total_charges}</td>
                      <td className="border border-slate-300 p-2 w-48"></td>
                      <td className="border border-slate-300 p-2 hidden"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {index < Object.keys(groupedData).length - 1 && <div className="page-break"></div>}
          </div>
        );
      })}

      <style>
        {`
          @page {
            size: A4;
            margin: 5mm;
          }
          .printable-content {
            position: relative;
          }
          .printable-content::after {
            content: "Page " counter(page);
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 8px;
            color: #000;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          th, td {
            word-wrap: break-word;
            word-break: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            padding: 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background-color: #f1f1f1;
          }
          .page-break {
            page-break-before: always;
          }
          
          /* Print-specific styles */
          @media print {
            table {
              table-layout: fixed;
            }
            th, td {
              word-wrap: break-word;
              word-break: break-word;
              overflow-wrap: break-word;
            }
            .w-24 { width: 7rem !important; }
            .w-24 { width: 6rem !important; }
            .w-40 { width: 10rem !important; }
            .w-32 { width: 8rem !important; }
            .w-16 { width: 4rem !important; }
            .w-20 { width: 5rem !important; }
            .w-48 { width: 12rem !important; }
          }
        `}
      </style>
    </div>
  );
};

export default PrintableReport;