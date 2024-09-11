"use client";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function Report() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    try {
      // setIsLoading(true);
      const response = await fetch(
        `/api/trx/vendor?limit=${10}&page=${page}&search=${search}`
      );
      const data = await response.json();
      setData(data);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      toast.error(error.msg);
    }
  };
  const onClear = () => {
    setSearch("");
  };
  useEffect(() => {
    getData();
  }, [page, search]);

  const exportToExcel = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/trx/vendor");
      const data = await response.json();

      const worksheet = XLSX.utils.json_to_sheet(data.data);

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileURL = URL.createObjectURL(
        new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "transactions.xlsx";
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 my-2">
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between md:items-center my-5">
        <h1 className="text-xl md:text-3xl">Transaction Report</h1>
        <div className="flex items-center gap-2">
          <Button
            isLoading={isLoading}
            onPress={() => exportToExcel()}
            className="bg-green-500 text-white"
            variant="flat"
            startContent={
              <FontAwesomeIcon icon={fas.faFileExcel} size="lg" color="white" />
            }
          >
            Export to Excel
          </Button>
        </div>
      </div>
      <Input
        isClearable
        className="w-full sm:max-w-[44%]"
        placeholder="Search by id..."
        startContent={<FontAwesomeIcon icon={fas.faSearch} size="lg" />}
        value={search}
        onClear={() => onClear()}
        onValueChange={(value) => setSearch(value)}
      />
      <Table
        isStriped
        aria-label="Example static collection table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={page}
              total={data.totalPages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NAME</TableColumn>
          <TableColumn>STATUS</TableColumn>
          <TableColumn>PAYMENT FEE</TableColumn>
          <TableColumn>CREATED AT</TableColumn>
        </TableHeader>
        <TableBody>
          {data?.data?.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item._id}</TableCell>
              <TableCell>{item.spotDetail.parkingSpot.name}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.paymentFee}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {data?.data?.length === 0 && (
          <TableBody emptyContent={"No data to display."}>{[]}</TableBody>
        )}
      </Table>
    </div>
  );
}
