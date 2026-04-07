import { useEffect, useState } from "react";
import { tablebody, tablehead } from "../../../../constant/BaseUrl";
import { getProLocSerRegister } from "../../../../services/Property/reports/PReportApis";

interface StPtranResult {
  doc_no: string;
  consignee: number;
  consignee_name: string;
  location: number;
  location_name: string;
  sur_no: string;
  area: number;
  sq_mtr1: number;
}

const ProRegLocServ = () => {
  const [data, setData] = useState<StPtranResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getProLocSerRegister();
        if (response) {
          setData(response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateCSV = () => {
    const header = [
      "File No",
      "Consignee",
      "Location",
      "Survey No.",
      "Hec. Are.",
      "Sq. Mtr."
    ];

    const rows = data.map((item) => [
      item.doc_no,
      item.consignee_name || "",
      item.location_name || "",
      item.sur_no,
      item.area,
      item.sq_mtr1
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "property_register.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full m-3 border p-2 rounded-lg">
      <div className="flex flex-col">
        <div className="border border-slate-300 rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 p-2">
              <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
                <tr>
                  <th className={tablehead}>File No</th>
                  <th className={tablehead}>Consignee</th>
                  <th className={tablehead}>Location</th>
                  <th className={tablehead}>Survey No.</th>
                  <th className={tablehead}>Hec. Are.</th>
                  <th className={tablehead}>Sq. Mtr.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">Loading...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Property details Not found.
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index}>
                      <td className={tablebody}>{item.doc_no}</td>
                      <td className={tablebody}>{item.consignee_name}</td>
                      <td className={tablebody}>{item.location_name}</td>
                      <td className={tablebody}>{item.sur_no}</td>
                      <td className={tablebody}>{item.area}</td>
                      <td className={tablebody}>{item.sq_mtr1}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end my-2 mx-2">
          <button
            type="button"
            onClick={generateCSV}
            className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProRegLocServ;
