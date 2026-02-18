import api from "../../config/api";
import { signupSchema } from "../../lib/zodSchemas";
import { useAuth } from "../../context/AuthContext.tsx";
import { type User } from "../../types/userType";

import { Button } from "../shadcn/button";
import { Input } from "../shadcn/input";
import { PasswordInput } from "../shadcn/password-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../shadcn/form";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const { setUser } = useAuth();

  // Define your form.
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (signupData: { name: string; email: string; password: string }) => {
      return api.post("/signup", signupData);
    },
    onSuccess: () => {
      setUser(form.getValues() as User);
      navigate("/dashboard");
    },
    onError: (error) => {
      const err = error as AxiosError<{ nameError?: string; emailError?: string; passwordError?: string }>;
      if (err.response?.data.nameError) {
        form.setError("name", { message: err.response?.data.nameError });
      }
      if (err.response?.data.emailError) {
        form.setError("email", { message: err.response?.data.emailError });
      }
      if (err.response?.data.passwordError) {
        form.setError("password", { message: err.response?.data.passwordError });
      }
    },
  });

  // Define a submit handler
  function onSubmit(values: z.infer<typeof signupSchema>) {
    mutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  {...field}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => {
                    setIsPasswordFocused(false);
                    field.onBlur();
                  }}
                />
              </FormControl>
              {isPasswordFocused && <FormDescription>Must be at least 8 characters and include letters and numbers</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing up..." : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
