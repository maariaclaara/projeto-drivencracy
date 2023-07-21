import  db  from "../database/database.connection.js";
import { ObjectId } from "mongodb";
import dayjs from "dayjs";


export async function newChoices(req, res) {

  const { title, pollId } = req.body;

  try {
    const poll = await db.collection("polls").findOne({ _id: new ObjectId(pollId) });
    if (!poll) {
      return res.status(404).send("A enquete não existe!");
    }
    if (dayjs(poll.expireAt) < dayjs()) {
      return res.status(403).send("A enquete está expirada!");
    }

    const choice = await db.collection("choices").findOne({ title });
    if (choice) {
      return res.status(409).send("A escolha já existe!");
    }

    const createChoice = { title, pollId };
    await db.collection("choices").insertOne(createChoice);

    res.status(201).send(createChoice);
  } catch (error) {
    res.send(error.message);
  }
}


export async function newVotes(req, res) {
    
    const { id } = req.params;
    const now = dayjs();
  
    try {
      const choice = await db.collection("choices").findOne({ _id: new ObjectId(id) });
      if (!choice) {
        return res.status(404).send("A opção não é válida!");
      }
  
      const poll = await db.collection("polls").findOne({ _id: new ObjectId(choice.pollId) });
      if (!poll) {
        return res.status(404).send("A opção não é válida!");
      }
  
      const expired = now.isAfter(dayjs(poll.expireAt));
      if (expired) {
        return res.status(403).send("A enquete está expirada!");
      }
  
      const vote = {
        createdAt: now.format("YYYY-MM-DD HH:mm"),
        choiceId: id,   
      };
   
      await db.collection("votes").insertOne(vote);
      
      res.status(201).send("Voto criado com sucesso!");
    } catch (error) {
      res.send(error.message);
    }
  }