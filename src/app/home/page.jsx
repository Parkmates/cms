"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteCookie } from "../actions";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CldUploadWidget } from "next-cloudinary";
import QRCodeScanner from "@/components/QRCodeScanner";
import QRScannerComponent from "@/components/scan";

export default function HomePage() {
  const pathname = usePathname();
  const [selected, setSelected] = useState("photos");
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkCookie = () => {
      const cookieValue = Cookies.get("role");
      if (cookieValue) {
        setRole(cookieValue);
      }
    };

    checkCookie();
  }, [pathname]);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAddParking,
    onOpen: onOpenAddParking,
    onOpenChange: onOpenAddParkingChange,
  } = useDisclosure();
  const {
    isOpen: isOpenScanQR,
    onOpen: onOpenScanQR,
    onOpenChange: onOpenScanQRChange,
  } = useDisclosure();
  const [data, setData] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [parking, setParking] = useState({
    name: "",
    address: "",
    imgUrl: [],
  });
  const getData = async () => {
    const response = await fetch("/api/parkspot");
    const data = await response.json();
    setData(data);
  };
  const getVendorList = async () => {
    const response = await fetch("/api/users?role=vendor");
    const data = await response.json();
    setVendor(data);
  };
  const getUserList = async () => {
    const response = await fetch("/api/users?role=user");
    const data = await response.json();
    setUser(data);
  };
  useEffect(() => {
    console.log("selected", selected);

    getData();
    if (selected === "vendorList") getVendorList();
    if (selected === "userList") getUserList();
  }, [selected]);

  const resetForm = () => {
    console.log("reset form");

    setParking({
      name: "",
      address: "",
      imgUrl: [],
    });
  };

  useEffect(() => {
    resetForm();
  }, [action]);
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
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      // console.log(formData);
      setIsLoading(true);
      const response = await fetch("/api/users/addVendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw await response.json();
      await getVendorList();
      setIsLoading(false);
      onOpenChange(false);
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

      // reset form
      parking.name = "";
      parking.address = "";
      parking.imgUrl = [];
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
      const response = await fetch(`/api/parkspot/${parking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parking),
      });
      if (!response.ok) throw await response.json();
      await getData();
      setIsLoading(false);
      await toast.success("Success add parking spot");
      onOpenAddParkingChange(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
    }
  };
  const handleDetail = async (id) => {
    try {
      const response = await fetch(`/api/parkspot/${id}`);
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
      const response = await fetch(`/api/parkspot/${id}`, {
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

  const handleRemoveImage = (index) => {
    setParking((prev) => ({
      ...prev,
      imgUrl: prev.imgUrl.filter((_, i) => i !== index),
    }));
  };
  const handleScanSuccess = (decodedText, decodedResult) => {
    console.log(`Code matched = ${decodedText}`);
    alert(`Transaction ID: ${decodedText}`);
  };
  return (
    <>
      <div className="p-4 md:px-12 md:py-7 md:mx-9 h-screen">
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
        <Tabs
          aria-label="Options"
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <Tab key="parkingList" title="Parking Spot List">
            <div className="flex flex-col gap-4 my-2">
              <div className="flex justify-between items-center my-5">
                <h1 className="text-3xl">Parking Spot List</h1>
                <div className="flex items-center gap-2">
                  <Button
                    onPress={() => {
                      onOpenAddParking();
                      setAction("add");
                    }}
                    className="bg-black text-white"
                    variant="flat"
                    startContent={
                      <FontAwesomeIcon
                        icon={fas.faPlus}
                        size="lg"
                        color="white"
                      />
                    }
                  >
                    Add Parking Spot
                  </Button>
                  <Button
                    onPress={() => {
                      onOpenScanQR();
                    }}
                    className="bg-green-500 text-white"
                    variant="flat"
                    startContent={
                      <FontAwesomeIcon
                        icon={fas.faQrcode}
                        size="lg"
                        color="white"
                      />
                    }
                  >
                    Scan QR
                  </Button>
                </div>
              </div>
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>ADDRESS</TableColumn>
                  <TableColumn>IMAGE</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.address}</TableCell>
                      <TableCell>
                        <Image
                          isZoomed
                          className="w-[100px] h-[63px]"
                          src={item.imgUrl[0]}
                          alt={item.name}
                        />
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          onPress={() => {
                            router.push(`/spot/${item._id}`);
                          }}
                          isIconOnly
                          className="bg-black text-white"
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon
                              icon={fas.faEye}
                              size="md"
                              color="white"
                            />
                          }
                        ></Button>
                        <Button
                          onPress={() => {
                            setAction("edit");
                            handleDetail(item._id);
                          }}
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
                        <Button
                          onPress={() => {
                            handleDelete(item._id);
                          }}
                          isIconOnly
                          className="bg-red-500 text-white"
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon
                              icon={fas.faTrash}
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
          </Tab>
          {role === "admin" && (
            <Tab
              key="vendorList"
              title="
          Vendor List"
            >
              <div className="flex flex-col gap-4 my-2">
                <div className="flex justify-between items-center my-5">
                  <h1 className="text-3xl">Vendor List</h1>
                  <div className="flex items-center gap-2">
                    {/* kalo role === admin */}
                    <Button
                      onPress={onOpen}
                      className="bg-black text-white"
                      variant="flat"
                      startContent={
                        <FontAwesomeIcon
                          icon={fas.faPlus}
                          size="lg"
                          color="white"
                        />
                      }
                    >
                      Add Vendor
                    </Button>
                  </div>
                </div>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>USER NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    {/* <TableColumn>ACTIONS</TableColumn> */}
                  </TableHeader>
                  <TableBody>
                    {vendor.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        {/* <TableCell className="space-x-2">
                        <Button
                          onPress={() => {
                            setAction("edit");
                            handleDetail(item._id);
                          }}
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
                        <Button
                          onPress={() => {
                            handleDelete(item._id);
                          }}
                          isIconOnly
                          className="bg-red-500 text-white"
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon
                              icon={fas.faTrash}
                              size="md"
                              color="white"
                            />
                          }
                        ></Button>
                      </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
          )}
          {role === "admin" && (
            <Tab
              key="userList"
              title="
          User List"
            >
              <div className="flex flex-col gap-4 my-2">
                <div className="flex justify-between items-center my-5">
                  <h1 className="text-3xl">User List</h1>
                </div>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>NAME</TableColumn>
                    <TableColumn>USER NAME</TableColumn>
                    <TableColumn>EMAIL</TableColumn>
                    <TableColumn>ROLE</TableColumn>
                    {/* <TableColumn>ACTIONS</TableColumn> */}
                  </TableHeader>
                  <TableBody>
                    {user.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>{item.role}</TableCell>
                        {/* <TableCell className="space-x-2">
                        <Button
                          onPress={() => {
                            setAction("edit");
                            handleDetail(item._id);
                          }}
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
                        <Button
                          onPress={() => {
                            handleDelete(item._id);
                          }}
                          isIconOnly
                          className="bg-red-500 text-white"
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon
                              icon={fas.faTrash}
                              size="md"
                              color="white"
                            />
                          }
                        ></Button>
                      </TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Tab>
          )}
        </Tabs>
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
                  onClick={(e) => handleAddVendor(e)}
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
                {action === "add" ? "Add" : "Edit"} parking spot
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
                <div className="overflow-x-auto whitespace-nowrap border border-gray-300 p-3 rounded-lg">
                  {parking.imgUrl.map((url, index) => (
                    <div key={index} className="relative inline-block mr-2">
                      <Image
                        isZoomed
                        width={140}
                        height={140}
                        alt={`Uploaded Image ${index + 1}`}
                        src={url}
                      />
                      {action === "edit" && (
                        <Button
                          onPress={() => handleRemoveImage(index)}
                          isIconOnly
                          className="absolute top-1 right-1 z-10 bg-red-500 text-white rounded-full w-5 h-5"
                          variant="flat"
                          startContent={
                            <FontAwesomeIcon
                              icon={fas.faXmark}
                              size="xs"
                              color="white"
                            />
                          }
                        ></Button>
                      )}
                    </div>
                  ))}
                </div>
                <CldUploadWidget
                  uploadPreset="parkmate"
                  onSuccess={(result, { widget }) => {
                    const secureUrl = result?.info?.secure_url;
                    // multiple
                    setParking((prev) => ({
                      ...prev,
                      imgUrl: [...prev.imgUrl, secureUrl],
                    }));
                  }}
                >
                  {({ open }) => {
                    return (
                      <Button
                        type="submit"
                        className="bg-black text-white"
                        variant="flat"
                        onPress={() => open()}
                      >
                        Upload an Image
                      </Button>
                    );
                  }}
                </CldUploadWidget>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    setAction("");
                  }}
                >
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
      <Modal
        placement="center"
        isOpen={isOpenScanQR}
        onOpenChange={onOpenScanQRChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Scan QR</ModalHeader>
              <ModalBody>
                {/* <QRCodeScanner onScanSuccess={handleScanSuccess} /> */}
                <QRScannerComponent />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
