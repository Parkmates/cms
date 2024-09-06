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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HomePage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAddParking,
    onOpen: onOpenAddParking,
    onOpenChange: onOpenAddParkingChange,
  } = useDisclosure();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [parking, setParking] = useState({
    name: "",
    address: "",
    imgUrl: "",
    motorSpot: "",
    carSpot: "",
    motorFee: "",
    carFee: "",
  });
  const getData = async () => {
    const response = await fetch("/api/parkspot");
    const data = await response.json();
    setData(data);
  };
  useEffect(() => {
    getData();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChangeParking = (e) => {
    const { name, value } = e.target;
    setParking({
      ...parking,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      setIsLoading(true);
      const response = await fetch("/api/users/addVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw await response.json();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  const handleAddParking = async (e) => {
    e.preventDefault();
    try {
      console.log(parking);
      setIsLoading(true);
      const response = await fetch("/api/parkspot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parking),
      });
      if (!response.ok) throw await response.json();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  return (
    <>
      <div className="p-4 md:px-12 md:py-7 md:mx-9 h-screen">
        <div className="flex flex-col gap-4 my-2">
          <div className="flex justify-between items-center my-5">
            <h1 className="text-3xl">Parking Spot List</h1>
            <div className="flex items-center gap-2">
              {/* kalo role === admin */}
              <Button
                onPress={onOpen}
                className="bg-black text-white"
                variant="flat"
                startContent={
                  <FontAwesomeIcon icon={fas.faPlus} size="lg" color="white" />
                }
              >
                Add Vendor
              </Button>
              <Button
                onPress={onOpenAddParking}
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add vendor
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                  variant="bordered"
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                />
                <Input
                  isRequired
                  label="Username"
                  placeholder="Enter your username"
                  type="text"
                  variant="bordered"
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  variant="bordered"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="text"
                  variant="bordered"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white"
                  variant="flat"
                  onClick={(e) => handleSubmit(e)}
                  isLoading={isLoading}
                >
                  submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenAddParking}
        onOpenChange={onOpenAddParkingChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add parking spot
              </ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter parking name"
                  type="text"
                  variant="bordered"
                  name="name"
                  onChange={handleChangeParking}
                  value={parking.name}
                />
                <Textarea
                  isRequired
                  variant="bordered"
                  label="Address"
                  placeholder="Enter your address"
                  name="address"
                  onChange={handleChangeParking}
                  value={parking.address}
                />
                <Input
                  isRequired
                  label="Image"
                  placeholder="Enter your image"
                  type="text"
                  variant="bordered"
                  name="imgUrl"
                  onChange={handleChangeParking}
                  value={parking.imgUrl}
                />
                <Input
                  isRequired
                  label="Motor Spot"
                  placeholder="Enter your motorSpot"
                  type="number"
                  variant="bordered"
                  name="motorSpot"
                  onChange={handleChangeParking}
                  value={parking.motorSpot}
                />
                <Input
                  isRequired
                  label="Motor Fee"
                  placeholder="Enter your motorFee"
                  type="number"
                  variant="bordered"
                  name="motorFee"
                  onChange={handleChangeParking}
                  value={parking.motorFee}
                />
                <Input
                  isRequired
                  label="Car Spot"
                  placeholder="Enter your carSpot"
                  type="number"
                  variant="bordered"
                  name="carSpot"
                  onChange={handleChangeParking}
                  value={parking.carSpot}
                />
                <Input
                  isRequired
                  label="Car Fee"
                  placeholder="Enter your carFee"
                  type="number"
                  variant="bordered"
                  name="carFee"
                  onChange={handleChangeParking}
                  value={parking.carFee}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white"
                  variant="flat"
                  onClick={(e) => handleAddParking(e)}
                  isLoading={isLoading}
                >
                  submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
