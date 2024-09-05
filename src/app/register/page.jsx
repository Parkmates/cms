"use client";
import { useState } from "react";
import AuthLayout from "../layouts/Auth";
import { Button, Input } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Register() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);
      if (!response.ok) throw await response.json();
      router.push("/login");
    } catch (error) {
      setIsLoading(false);
      toast.error(error.msg);
      console.log(error.msg);
    }
  };
  return (
    <>
      <AuthLayout>
        <div className="flex flex-col gap-10">
          <h1 className="text-3xl">Create a new account</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex flex-col gap-5">
              <Input
                variant="bordered"
                type="text"
                label="Name"
                placeholder="Enter your name"
                className="max-w-xl"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                isRequired
                variant="bordered"
                type="text"
                label="Username"
                placeholder="Enter your username"
                className="max-w-xl"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                isRequired
                variant="bordered"
                type="email"
                label="Email"
                placeholder="Enter your email"
                className="max-w-xl"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                isRequired
                label="Password"
                variant="bordered"
                placeholder="Enter your password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    <FontAwesomeIcon
                      icon={isVisible ? faEye : faEyeSlash}
                      className="text-default-400"
                    />
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-xl"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Button
                isLoading={isLoading}
                className="bg-black text-white w-full font-bold mt-3"
                variant="flat"
                type="submit"
              >
                Sign in
              </Button>
              <p>
                already have an account? {""}
                <Link href="/login" className="underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}
