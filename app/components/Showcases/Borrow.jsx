import React, {Component} from "react";
import counterpart from "counterpart";
import Translate from "react-translate-component";
import {Button, Card, Steps, Tooltip} from "bitshares-ui-style-guide";
import debounceRender from "react-debounce-render";
import AssetWrapper from "../Utility/AssetWrapper";
import {connect} from "alt-react";
import {ChainStore} from "bitsharesjs";
import WalletUnlockActions from "actions/WalletUnlockActions";

import BorrowModal from "../Modal/BorrowModal";
import AccountStore from "../../stores/AccountStore";
import Icon from "../Icon/Icon";
import AssetSelect from "../Utility/AssetSelect";
import * as ReactDOM from "react-dom";

class Borrow extends Component {
    constructor() {
        super();
        this.state = {
            isBorrowBaseModalVisible: false,
            selectedAsset: null,
            step: 0
        };
        this.steps = [
            {
                key: "introduction",
                icon: "borrow"
            },
            {
                key: "concept",
                has_legend: true
            },
            {
                key: "setup",
                has_legend: true
            },
            {
                key: "benefits",
                has_legend: true
            },
            {
                key: "risks",
                has_legend: true
            }
        ];
        this.showBorrowModal = this.showBorrowModal.bind(this);
        this.hideBorrowModal = this.hideBorrowModal.bind(this);
    }
    componentWillMount() {}
    componentWillReceiveProps(np) {}
    getAccount() {}

    showBorrowModal(asset) {
        // needs a known account
        if (!this.props.currentAccount) {
            WalletUnlockActions.unlock()
                .then(() => {
                    this.setState({
                        assetToBorrow: this.props.bitAssets[0],
                        isBorrowBaseModalVisible: true
                    });
                })
                .catch(() => {});
        } else {
            this.setState({
                assetToBorrow: this.props.bitAssets[0],
                isBorrowBaseModalVisible: true
            });
        }
    }

    hideBorrowModal() {
        this.setState({
            assetToBorrow: null,
            isBorrowBaseModalVisible: false
        });
    }

    next() {
        let step = this.state.step + 1;
        if (step >= this.steps.length) step = this.steps.length;
        this.setState({step});
    }

    prev() {
        let step = this.state.step - 1;
        if (step < 0) step = 0;
        this.setState({step});
    }

    onAssetChange(selected_asset) {
        this.setState({
            selectedAsset: selected_asset
        });
    }

    render() {
        let currentAccount = ChainStore.getAccount(this.props.currentAccount);
        let accountLoaded = !(
            !currentAccount || typeof currentAccount === "string"
        );
        const current = this.state.step;
        const tinyScreen = window.innerWidth <= 800;
        const started = this.state.step > 0;

        const selectedAssetObject = ChainStore.getAsset(
            this.state.selectedAsset
        );
        let steps = this.steps;
        let legend = null;
        if (current < steps.length) {
            try {
                if (steps[current].has_legend) {
                    legend = counterpart.translate(
                        "showcases.borrow.steps_" +
                            steps[current].key +
                            ".text_legend"
                    );
                    legend = legend.split("\n").map(item => {
                        return item.split(":");
                    });
                }
            } catch (err) {
                legend = counterpart.translate(
                    "showcases.borrow.steps_" +
                        steps[current].key +
                        ".text_legend"
                );
            }
        }

        let finishedCard = null;
        if (current >= steps.length) {
            finishedCard = (
                <Card>
                    <div className={"center-content"}>
                        <Translate
                            content={"showcases.borrow.choose"}
                            component={"h4"}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <div>
                            <AssetSelect
                                style={{
                                    width: "12rem",
                                    marginBottom: "1rem"
                                }}
                                assets={[
                                    "1.3.113",
                                    "1.3.120",
                                    "1.3.121",
                                    "1.3.1325",
                                    "1.3.105",
                                    "1.3.106",
                                    "1.3.103"
                                ]}
                                onChange={this.onAssetChange.bind(this)}
                            />
                            <Tooltip
                                title={counterpart.translate(
                                    "showcases.borrow.borrow_tooltip"
                                )}
                                placement="bottom"
                            >
                                <Button
                                    type="primary"
                                    style={{
                                        width: "12rem"
                                    }}
                                    disabled={
                                        this.state.selectedAsset !== null &&
                                        accountLoaded
                                            ? currentAccount.get("id") ===
                                              "1.2.3"
                                            : true
                                    }
                                    onClick={this.showBorrowModal}
                                >
                                    <Translate content="exchange.borrow" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </Card>
            );
        }

        return (
            <div
                style={{
                    align: "center",
                    display: "flex",
                    justifyContent: "center"
                }}
                onKeyDown={this.onKeyDown.bind(this)}
            >
                <Card
                    style={{
                        borderRadius: "50px",
                        width: "70%",
                        maxWidth: "70rem",
                        paddingTop: "2rem",
                        paddingBottom: "2rem"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center"
                        }}
                    >
                        <Translate
                            component="h1"
                            content={
                                finishedCard != null
                                    ? "showcases.borrow.now_ready"
                                    : "showcases.borrow.title_long"
                            }
                        />
                    </div>
                    {started &&
                        (!tinyScreen ? (
                            <Steps progressDot current={current - 1}>
                                {steps.map((item, index) => {
                                    if (index == 0) return null;
                                    return (
                                        <Steps.Step
                                            key={item.key}
                                            title={counterpart.translate(
                                                "showcases.borrow.steps_" +
                                                    item.key +
                                                    ".title"
                                            )}
                                        />
                                    );
                                })}
                            </Steps>
                        ) : current < this.steps.length ? (
                            <React.Fragment>
                                {current + ". "}
                                <Translate
                                    content={
                                        "showcases.borrow.steps_" +
                                        steps[current].key +
                                        ".title"
                                    }
                                />
                            </React.Fragment>
                        ) : null)}
                    <div
                        style={{
                            paddingTop: "1rem",
                            paddingBottom: "1rem"
                        }}
                    >
                        {finishedCard != null && finishedCard}
                        {finishedCard == null && (
                            <Card onKeyDown={this.onKeyDown.bind(this)}>
                                {!!steps[current].icon && (
                                    <Icon name="steps[current].icon" />
                                )}
                                <Translate
                                    component="h2"
                                    content={
                                        "showcases.borrow.steps_" +
                                        steps[current].key +
                                        ".title_within"
                                    }
                                />

                                <Translate
                                    component="p"
                                    content={
                                        "showcases.borrow.steps_" +
                                        steps[current].key +
                                        ".text"
                                    }
                                />

                                {!!steps[current].has_legend && (
                                    <React.Fragment>
                                        {legend.map((content, index) => {
                                            return (
                                                <p key={"borrow_subp_" + index}>
                                                    <strong>
                                                        {content[0]}
                                                    </strong>
                                                    : {content[1]}
                                                </p>
                                            );
                                        })}
                                    </React.Fragment>
                                )}
                            </Card>
                        )}
                    </div>
                    <div className="steps-action">
                        {current < steps.length && (
                            <Button
                                type="primary"
                                onClick={() => this.next()}
                                tabIndex="0"
                                ref="borrowdiv"
                                onKeyDown={this.onKeyDown.bind(this)}
                            >
                                {current == 0 && (
                                    <Translate
                                        content={"showcases.borrow.get_started"}
                                    />
                                )}
                                {current > 0 &&
                                    current < steps.length - 1 && (
                                        <Translate
                                            content={"showcases.borrow.next"}
                                        />
                                    )}
                                {current === steps.length - 1 && (
                                    <Translate
                                        content={"showcases.borrow.do_it"}
                                    />
                                )}
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{marginLeft: 8}}
                                onClick={() => this.prev()}
                            >
                                <Translate
                                    content={"showcases.borrow.previous"}
                                />
                            </Button>
                        )}
                    </div>
                </Card>
                {accountLoaded &&
                    !!this.state.assetToBorrow && (
                        <BorrowModal
                            visible={this.state.isBorrowBaseModalVisible}
                            hideModal={this.hideBorrowModal}
                            quote_asset={selectedAssetObject.get("id")}
                            backing_asset={selectedAssetObject.getIn([
                                "bitasset",
                                "options",
                                "short_backing_asset"
                            ])}
                            account={currentAccount}
                        />
                    )}
            </div>
        );
    }

    componentDidMount() {
        this.focusDiv();
    }

    componentDidUpdate() {
        this.focusDiv();
    }

    focusDiv() {
        if (!!this.refs.borrowdiv) {
            ReactDOM.findDOMNode(this.refs.borrowdiv).focus();
        }
    }

    onKeyDown(e) {
        // arrow up/down button should select next/previous list element
        if (e.keyCode === 38 || e.keyCode === 39 || e.key == "ArrowRight") {
            this.next();
        } else if (e.keyCode === 40 || e.key == "ArrowLeft") {
            this.prev();
        }
    }
}

Borrow = debounceRender(Borrow, 50, {leading: false});

Borrow = connect(
    Borrow,
    {
        listenTo() {
            return [AccountStore];
        },
        getProps() {
            return {
                currentAccount:
                    AccountStore.getState().currentAccount ||
                    AccountStore.getState().passwordAccount
            };
        }
    }
);

export default (Borrow = AssetWrapper(Borrow, {
    propNames: ["bitAssets"],
    defaultProps: {
        bitAssets: [
            "1.3.103",
            "1.3.113",
            "1.3.120",
            "1.3.121",
            "1.3.958",
            "1.3.1325",
            "1.3.1362",
            "1.3.105",
            "1.3.106"
        ]
    },
    asList: true
}));
