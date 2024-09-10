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

export default function Report() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const getData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch(
        `/api/trx/vendor?page=${page}&search=${search}`
      );
      const data = await response.json();
      setData(data);
      setIsLoadingData(false);
    } catch (error) {
      setIsLoadingData(false);
      toast.error(error.msg);
    }
  };
  const onClear = () => {
    setSearch("");
  };
  useEffect(() => {
    getData();
    console.log(search, "<<<< search");
  }, [page, search]);

  return (
    <div className="flex flex-col gap-4 my-2">
      <div className="flex flex-col gap-4 md:gap-0 md:flex-row justify-between md:items-center my-5">
        <h1 className="text-xl md:text-3xl">Transaction Report</h1>
        <div className="flex items-center gap-2">
          <Button
            onPress={() => {
              onOpenScanQR();
              setScanAction("checkin");
            }}
            className="bg-green-500 text-white"
            variant="flat"
            startContent={
              <FontAwesomeIcon icon={fas.faFileExcel} size="lg" color="white" />
            }
          >
            Export to CSV
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
      </Table>
    </div>
  );
}
