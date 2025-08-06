sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageBox',
    "sap/ui/core/Fragment"
], (Controller, ODataModel, Filter, FilterOperator, JSONModel, MessageBox, Fragment) => {
    "use strict";
    var oRouter, oController, UIComponent
    return Controller.extend("com.sap.lh.mr.zlhlegcorrespodence.controller.correspondence", {
        onInit() {
            debugger;
            oController = this;
            UIComponent = oController.getOwnerComponent();
            oRouter = UIComponent.getRouter();
            var oLegacyCorrespModel = new JSONModel({
                LegacyCorresp: []
            });
            oController.getView().setModel(oLegacyCorrespModel, "LegacyCorrespModel");
            // if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getRenderer("fiori2")) {
            //     sap.ushell.Container.getRenderer("fiori2").setHeaderVisibility(false, true);
            // }
            oRouter.getRoute("Routecorrespondence").attachPatternMatched(oController._onRouteMatch, oController);
        },
        _onRouteMatch: function (oEvent) {
            debugger;
            var oComponentData = UIComponent.getComponentData();
            var contractAccount = '';
            if (oComponentData && oComponentData.startupParameters) {
                var oParams = oComponentData.startupParameters;
                contractAccount = oParams.ContractAccount[0];
                if (contractAccount) {
                    oController.getView().byId("idCA").setValue(contractAccount);
                }
            }
            var oLegacyCorrespModel = oController.getView().getModel("LegacyCorrespModel");
            var oModel = oController.getOwnerComponent().getModel();
            var aFilter = [];
            if (contractAccount) {
                aFilter.push(new Filter("vkont", FilterOperator.EQ, contractAccount));
            }
            oModel.read("/ZC_CN_LEG_CORR_CON", {
                filters: aFilter,
                success: function (response) {
                    if (response.results.length > 0) {
                        oLegacyCorrespModel.setProperty("/LegacyCorresp", response.results);
                    }
                    else if (response.results.length === 0) {
                        oLegacyCorrespModel.setProperty("/LegacyCorresp", {});
                    }
                },
                error: (oError) => {
                    oLegacyCorrespModel.setProperty("/LegacyCorresp", {});
                    MessageBox.error("Error loading records : " + oError.message);
                }
            });
        },
        onSearch: function () {
            debugger;
            const oView = this.getView();
            var oTable = oController.getView().byId("tblLegacyCorrespTable");
            var oJsonModel = new sap.ui.model.json.JSONModel();
            var oLegacyCorrespModel = oController.getView().getModel("LegacyCorrespModel");
            var aFilter = [];
            const contractAccount = this.getView().byId("idCA").getValue();

            if (contractAccount !== "") {
                aFilter.push(new Filter("vkont", FilterOperator.EQ, contractAccount));
            }

            var oModel = oController.getOwnerComponent().getModel();
            var oBusyDialog = new sap.m.BusyDialog({
                title: "Loading Data",
                text: "Please wait..."
            });
            oBusyDialog.open();
            oModel.read("/ZC_CN_LEG_CORR_CON", {
                filters: aFilter,
                success: function (response) {
                    oBusyDialog.close();
                    if (response.results.length > 0) {
                        oLegacyCorrespModel.setProperty("/LegacyCorresp", response.results);
                    }
                    else if (response.results.length === 0) {
                        oLegacyCorrespModel.setProperty("/LegacyCorresp", {});
                        return MessageBox.error("There are no records with selection.")
                    }
                },
                error: (oError) => {
                    oBusyDialog.close();
                    oJsonModel.setData({});
                    oView.byId("tblLegacyCorrespTable").setModel(oJsonModel);
                    var oResponseText = oError.responseText;
                    var sParsedResponse = JSON.parse(oResponseText);
                    const oMessage = sParsedResponse.error.message.value;
                    return MessageBox.error(oMessage);
                }
            });


        }
    });
});