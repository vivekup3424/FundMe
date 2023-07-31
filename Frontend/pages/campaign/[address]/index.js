import React, { useEffect } from "react";
import Link from "next/link";
import PageLayout from "../../../Components/PageLayout";
import Contribute from "../../../Components/Contribute";
import Campaign from "../../../ethereum/campaign";
import web3 from "web3";
import { Button, Card, Grid, GridColumn } from "semantic-ui-react";
export default function View(props) {
  const { currentCamp, summary } = props;
  const items = [
    {
      header: summary["4"],
      meta: "Address of Manager",
      description:
        "The Manager created this Campaign instance and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: summary["0"],
      meta: "Minimum Contribution",
      description:
        "You need to donate atleast this amount in wei in order to become an approver for this campaign",
      style: { overflowWrap: "break-word" },
    },
    {
      header: summary["2"],
      meta: "Number of Requests",
      description:
        "A Request made to withdraw money from the contract. Requests must be approved by approvers",
      style: { overflowWrap: "break-word" },
    },
    {
      header: summary["3"],
      meta: "Number of Approvers",
      description: "Number of people who have donated to the campaign",
      style: { overflowWrap: "break-word" },
    },
    {
      header: web3.utils.fromWei(summary["1"], "ether"),
      meta: "Campaign Balance(ether)",
      description:
        "The balance denotes the money left to be spent on the campaign",
      style: { overflowWrap: "break-word" },
    },
  ];
  useEffect(() => {
    //(props.summary);
  }, []);
  return (
    <PageLayout>
      <h3>Campaign Details: {props.currentCamp}</h3>
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column width={9}>
            <Card.Group items={items} />
          </Grid.Column>
          <Grid.Column width={5}>
            <Contribute address={currentCamp} />
            <Link href={`${currentCamp}/requests`}>
              <Button color="sky blue">View Requests</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </PageLayout>
  );
}
export async function getServerSideProps(context) {
  const { params } = context;
  const { address } = params;
  const campinstance = Campaign(address);
  const summary = await campinstance.methods.SummariseCampaign().call();
  //({ ...summary });
  return {
    props: {
      currentCamp: address,
      summary: { ...summary },
    },
  };
}
