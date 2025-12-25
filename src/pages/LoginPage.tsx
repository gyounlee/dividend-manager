import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({onLoginSuccess}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    //alert(`로그인 시도: ${email}`);
    // Temporary id/password
    const adminUser = {email: "test@test.com", password:"1111"};

    if (email == adminUser.email && password == adminUser.password) {
      // 여기에서 메인 대시보드로 이동하는 로직 추가
      onLoginSuccess();
    } else {
      alert("이메일 또는 비밀번호가 틀렸습니다.")
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">서비스 접속을 위해 정보를 입력하세요.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600">로그인</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}