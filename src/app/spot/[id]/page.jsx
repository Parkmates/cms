"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteCookie } from "@/app/actions";

export default function ParkingPage({ params }) {
  const router = useRouter();
  const {
    isOpen: isOpenAddParking,
    onOpen: onOpenAddParking,
    onOpenChange: onOpenAddParkingChange,
  } = useDisclosure();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");
  const [parking, setParking] = useState({
    area: "",
    fee: "",
    floor: "",
    quantity: "",
    type: "",
  });
  const getData = async () => {
    const response = await fetch(`/api/parkspot/${params.id}`);
    const data = await response.json();
    setData(data);
  };
  useEffect(() => {
    getData();
  }, []);

  const resetForm = () => {
    console.log("reset form");

    setParking({
      area: "",
      fee: "",
      floor: "",
      quantity: "",
      type: "",
    });
  };

  useEffect(() => {
    resetForm();
  }, [action]);
  const handleChangeParking = (e) => {
    const { name, value } = e.target;

    setParking({
      ...parking,
      [name]: value,
    });
  };
  const handleChangeType = (e) => {
    const { currentKey } = e;
    setParking((prevParking) => ({
      ...prevParking,
      type: currentKey,
    }));
  };

  const handleAddParking = async (e) => {
    e.preventDefault();
    try {
      console.log(parking);
      setIsLoading(true);
      const response = await fetch(`/api/parkspot/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parking),
      });
      if (!response.ok) throw await response.json();

      // reset form
      parking.area = "";
      parking.fee = "";
      parking.floor = "";
      parking.quantity = "";
      parking.type = "";
      await getData();
      setIsLoading(false);
      await toast.success("Success add parking spot");
      onOpenAddParkingChange(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  const handleUpdateParking = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/parkspot/${params.id}/${parking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parking),
        }
      );
      if (!response.ok) throw await response.json();
      await getData();
      setIsLoading(false);
      await toast.success("Success update parking spot");
      onOpenAddParkingChange(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  const handleDetail = async (id) => {
    try {
      const response = await fetch(`/api/parkspot/${params.id}/${id}`);
      const data = await response.json();
      setParking(data);
      onOpenAddParkingChange(true);
      if (!response.ok) throw await response.json();
    } catch (error) {
      toast.error(error.msg);
    }
  };
  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/parkspot/${params.id}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw await response.json();
      await getData();
      toast.success("Success delete parking spot");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  return (
    <>
      <div className="p-4 md:px-12 md:py-7 md:mx-9 h-screen">
        <div className="flex items-center gap-2 justify-between">
          <Button
            onPress={() => {
              router.push("/home");
            }}
            isIconOnly
            className="bg-black text-white"
            variant="flat"
            startContent={
              <FontAwesomeIcon icon={fas.faArrowLeft} size="md" color="white" />
            }
          ></Button>
          <Button
            onPress={async () => {
              await deleteCookie();
              router.push("/login");
            }}
            className="mr-4"
            color="danger"
            variant="flat"
          >
            Logout
          </Button>
        </div>
        <div className="flex flex-col gap-4 my-2">
          <div className="flex justify-between items-center my-5">
            <h1 className="text-xl md:text-3xl">Detail Parking Spot List</h1>
            <div className="flex items-center gap-2">
              <Button
                onPress={() => {
                  onOpenAddParking();
                  setAction("add");
                }}
                className="bg-black text-white"
                variant="flat"
                startContent={
                  <FontAwesomeIcon icon={fas.faPlus} size="lg" color="white" />
                }
              >
                Add Spot
              </Button>
            </div>
          </div>
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>FEE</TableColumn>
              <TableColumn>AREA</TableColumn>
              <TableColumn>FLOOR</TableColumn>
              <TableColumn>QTY</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {data?.spotList?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="capitalize">{item.type}</TableCell>
                  <TableCell>{item.fee}</TableCell>
                  <TableCell>{item.area}</TableCell>
                  <TableCell>{item.floor}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="space-x-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon icon={fas.faEllipsis} />
                          }
                        ></Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        variant="faded"
                        aria-label="Dropdown menu with description"
                      >
                        <DropdownSection title="Actions" showDivider>
                          <DropdownItem
                            onPress={() => {
                              setAction("edit");
                              handleDetail(item._id);
                            }}
                            key="edit"
                            description="Allows you to edit the spot"
                            startContent={
                              <FontAwesomeIcon
                                size="sm"
                                icon={fas.faEdit}
                                className="text-xl text-default-500 pointer-events-none flex-shrink-0"
                              />
                            }
                          >
                            Edit spot
                          </DropdownItem>
                        </DropdownSection>
                        <DropdownSection title="Danger zone">
                          <DropdownItem
                            onPress={() => {
                              handleDelete(item._id);
                            }}
                            key="delete"
                            className="text-danger"
                            color="danger"
                            description="Permanently delete the spot"
                            startContent={
                              <FontAwesomeIcon
                                size="sm"
                                icon={fas.faTrash}
                                className="text-xl text-default-500 pointer-events-none flex-shrink-0"
                              />
                            }
                          >
                            Delete spot
                          </DropdownItem>
                        </DropdownSection>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal
        isOpen={isOpenAddParking}
        onOpenChange={onOpenAddParkingChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {action === "add" ? "Add" : "Edit"} detail parking spot
              </ModalHeader>
              <ModalBody>
                <Select
                  variant="bordered"
                  placeholder="Select type"
                  label="Type"
                  className="max-w-md"
                  selectedKeys={[parking.type]}
                  onSelectionChange={handleChangeType}
                >
                  <SelectItem key="car">Car</SelectItem>
                  <SelectItem key="motorcycle">Motorcycle</SelectItem>
                </Select>

                <Input
                  isRequired
                  label="Fee"
                  placeholder="Enter your fee"
                  type="number"
                  variant="bordered"
                  name="fee"
                  onChange={handleChangeParking}
                  value={parking.fee}
                />
                <Input
                  isRequired
                  label="Area"
                  placeholder="Enter your area"
                  type="text"
                  variant="bordered"
                  name="area"
                  onChange={handleChangeParking}
                  value={parking.area}
                />
                <Input
                  isRequired
                  label="Floor"
                  placeholder="Enter your floor"
                  type="text"
                  variant="bordered"
                  name="floor"
                  onChange={handleChangeParking}
                  value={parking.floor}
                />
                <Input
                  isRequired
                  label="Quantity"
                  placeholder="Enter your quantity"
                  type="number"
                  variant="bordered"
                  name="quantity"
                  onChange={handleChangeParking}
                  value={parking.quantity}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {action === "add" ? (
                  <Button
                    type="submit"
                    className="bg-black text-white"
                    variant="flat"
                    onClick={(e) => handleAddParking(e)}
                    isLoading={isLoading}
                  >
                    submit
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-black text-white"
                    variant="flat"
                    onClick={(e) => handleUpdateParking(e)}
                    isLoading={isLoading}
                  >
                    update
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
