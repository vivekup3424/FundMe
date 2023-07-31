import React, { Component, createRef, useEffect } from "react";
import { Menu, Sticky, Image, Icon } from "semantic-ui-react";
import Link from "next/link";
import Web3 from "web3";

export default function Header() {
  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.web3 = new Web3(window.ethereum);
      }
    })();
  });

  return (
    <div>
      <Sticky>
        <Menu
          color="teal"
          size="huge"
          widths={5}
          style={{ marginBottom: "5vh" }}
        >
          <Menu.Item>
            <Link href="/">DecCrowdFund</Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/">View Campaigns</Link>
          </Menu.Item>
          <Menu.Item>
            <Link href="/campaign/new">
              <Icon name="add"></Icon>
            </Link>
          </Menu.Item>
        </Menu>
      </Sticky>
    </div>
  );
}
