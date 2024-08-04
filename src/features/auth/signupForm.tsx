"use client";

import { signUp } from "@/app/(auth)/signup/actions";
import { type SignUpType, signUpSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Button, Checkbox, Divider, Input, Link } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [error, setError] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      userName: "",
    },
  });

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = (values: SignUpType) => {
    startTransition(async () => {
      const { error } = await signUp(values);
      if (error) setError(error);
    });
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pt-6 pb-10 shadow-small">
      <p className="pb-2 font-medium text-xl">Sign Up</p>
      {error && <p className="text-center text-destructive">{error}</p>}
      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isRequired
          label="Username"
          placeholder="Enter your username"
          type="text"
          variant="bordered"
          isInvalid={!!errors?.userName}
          errorMessage={errors.userName?.message}
          {...register("userName")}
        />
        <Input
          isRequired
          label="Email Address"
          placeholder="Enter your email"
          type="email"
          variant="bordered"
          isInvalid={!!errors?.email}
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <Input
          isRequired
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
              ) : (
                <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
              )}
            </button>
          }
          label="Password"
          placeholder="Enter your password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
          isInvalid={!!errors?.password}
          errorMessage={errors.password?.message}
          {...register("password")}
        />

        <Button isLoading={isPending} color="primary" type="submit">
          Sign Up
        </Button>
      </form>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-default-500 text-tiny">OR</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button startContent={<Icon icon="flat-color-icons:google" width={24} />} variant="bordered">
          Continue with Google
        </Button>
        {/* <Button
          startContent={
            <Icon className="text-default-500" icon="fe:github" width={24} />
          }
          variant="bordered"
        >
          Continue with Github
        </Button> */}
      </div>
      <p className="text-center text-small">
        Already have an account?&nbsp;
        <Link href="/login" size="sm">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
