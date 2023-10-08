import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

//bu bölümdeki tüm testlerden önce otomatik olarak render et
let kullaniciAdi;
beforeEach(() => {
  render(<IletisimFormu />);
  kullaniciAdi = screen.getByLabelText("Ad*");
});
test("hata olmadan render ediliyor", () => {
  // render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  //Arrance
  //   render(<IletisimFormu />);
  //act
  //const heading = screen.getByText(/İletişim Formu/i);
  const heading = screen.getByRole("heading", { level: 1 });
  //assert
  expect(heading).toBeInTheDocument();
  expect(heading).toBeTruthy();
  expect(heading).toHaveTextContent("İletişim Formu");
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  //   const kullaniciAdi = screen.getByLabelText("Ad*");
  userEvent.type(kullaniciAdi, "test");
  const errMessages = await screen.findAllByTestId("error");
  expect(errMessages).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  const buttonSubmit = screen.getByRole("button");
  userEvent.click(buttonSubmit);
  await waitFor(() => {
    const errMessages = screen.queryAllByTestId("error");
    expect(errMessages).toHaveLength(3);
  });
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  //   const kullaniciAdi = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const buttonSubmit = screen.getByRole("button");

  userEvent.type(kullaniciAdi, "reacttest");
  userEvent.type(soyad, "soyad");

  userEvent.click(buttonSubmit);
  const errMessage = await screen.findAllByTestId("error");
  expect(errMessage).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  const email = screen.getByLabelText(/email*/i);
  userEvent.type(email, "asd");
  await waitFor(() => {
    const errMsg = screen.getByTestId("error");
    expect(errMsg).toHaveTextContent(
      "email geçerli bir email adresi olmalıdır."
    );
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  const buttonSubmit = screen.getByRole("button");
  userEvent.click(buttonSubmit);

  const errMsg = await screen.findByText(/soyad gereklidir./i);
  expect(errMsg).toBeInTheDocument();
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const email = screen.getByLabelText(/email*/i);
  //   const kullaniciAdi = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const buttonSubmit = screen.getByRole("button");

  userEvent.type(kullaniciAdi, "kdsmcl");
  userEvent.type(soyad, "soyad");
  userEvent.type(email, "jnsk@gmail.com");
  userEvent.click(buttonSubmit);

  await waitFor(() => {
    const nameInput = screen.getByTestId("firstnameDisplay");
    const surnameInput = screen.getByTestId("lastnameDisplay");
    const emailInput = screen.getByTestId("emailDisplay");
    const messageInput = screen.queryByTestId("messageDisplay");
    const errMessages = screen.queryAllByTestId("error");

    expect(nameInput).toBeInTheDocument();
    expect(surnameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).not.toBeInTheDocument();
    expect(errMessages).toHaveLength(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  const email = screen.getByLabelText(/email*/i);
  //   const kullaniciAdi = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const buttonSubmit = screen.getByRole("button");
  const mesaj = screen.getByLabelText(/mesaj/i);

  userEvent.type(kullaniciAdi, "kdsmcl");
  userEvent.type(soyad, "soyad");
  userEvent.type(email, "jnsk@gmail.com");
  userEvent.type(mesaj, "message");
  userEvent.click(buttonSubmit);

  await waitFor(() => {
    const mesajInput = screen.queryByTestId("messageDisplay");

    expect(mesajInput).toBeInTheDocument();
    expect(mesajInput.textContent).toMatch(/message/i);
  });
});
