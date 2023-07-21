import dayjs from "dayjs";
import { ObjectId } from "mongodb";
import  db  from "../database/database.connection.js";

export async function newPolls(req, res) {
  const { title, expireAt } = req.body;

  if (title === "") {
    return res.status(422).send("O título não pode estar vazio!");
  }

  const expire = expireAt
    ? dayjs(expireAt).format("YYYY-MM-DD HH:mm")
    : dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");

  try {
    const poll = { title, expireAt: expire };
    await db.collection("polls").insertOne(poll);
    res.status(201).send(poll);
  } catch (error) {
    res.send(error.message);
  }
}