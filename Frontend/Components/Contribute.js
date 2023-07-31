import React, { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import Router from "next/router";
export default function Contribute(props) {
  const handleclick = async (event) => {
    event.preventDefault();
    const camp = Campaign(props.address);
    try {
      setload(true);
      if (!value)
        throw Error("Minimum Contribution needs to be greater than 0");
      const accounts = await web3.eth.getAccounts();
      await camp.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });
      onDismiss();
      Router.push(`/campaign/${props.address}`);
    } catch (e) {
      setload(false);
      seterr(e.message);
    }
  };
  const [value, setvalue] = useState(0);
  const [load, setload] = useState(false);
  const [err, seterr] = useState("");
  const onDismiss = () => {
    seterr("");
    setvalue(0);
    setload(false);
  };
  return (
    <div className="border-solid border-2 border-grey p-5 mb-8">
      <h3>Amount to Contribute</h3>
      <Form onSubmit={handleclick}>
        <Form.Field>
          <Input
            placeholder="Minimum Contribution"
            label="ether"
            type="Number"
            min="0"
            step="0.001"
            labelPosition="right"
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
            }}
          />
        </Form.Field>
        <Button type="submit" loading={load}>
          Contribute!
        </Button>
      </Form>
      {err ? (
        <Message
          negative
          header="Oops! An Error was encountered"
          content={err}
          onDismiss={onDismiss}
        />
      ) : (
        ""
      )}
    </div>
  );
}
