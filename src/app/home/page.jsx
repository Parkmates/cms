"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

export default function ListMyRecipe() {
  const [data, setData] = useState([]);
  const getData = async () => {
    const response = await fetch("/api/parkspot");
    const data = await response.json();
    setData(data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="p-4 md:px-12 md:py-7 md:mx-9 h-screen">
        <div className="flex flex-col gap-4 my-2">
          <div className="flex justify-between items-center my-5">
            <h1 className="text-3xl">Parking Spot List</h1>
            <div className="flex items-center gap-2">
              {/* kalo role === admin */}
              <Button
                className="bg-black text-white"
                variant="flat"
                startContent={
                  <FontAwesomeIcon icon={fas.faPlus} size="lg" color="white" />
                }
              >
                Add Vendor
              </Button>
              <Button
                className="bg-black text-white"
                variant="flat"
                startContent={
                  <FontAwesomeIcon icon={fas.faPlus} size="lg" color="white" />
                }
              >
                Add Parking Spot
              </Button>
            </div>
          </div>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>IMAGE</TableColumn>
              <TableColumn>MOTOR SPOT</TableColumn>
              <TableColumn>CAR SPOT</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Image
                      isZoomed
                      className="w-[100px] h-[63px]"
                      src={item.imgUrl}
                      alt={item.name}
                    />
                  </TableCell>
                  <TableCell>{item.motorSpot}</TableCell>
                  <TableCell>{item.carSpot}</TableCell>
                  <TableCell>
                    <Button
                      onPress={() => console.log(`Edit ${item._id}`)}
                      isIconOnly
                      className="bg-black text-white"
                      variant="flat"
                      startContent={
                        <FontAwesomeIcon
                          icon={fas.faEdit}
                          size="md"
                          color="white"
                        />
                      }
                    ></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
