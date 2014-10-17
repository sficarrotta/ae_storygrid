Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        var f1 = Ext.create('Rally.data.QueryFilter', 
            {
                property: 'ScheduleState', 
                operator: '=', 
                value: 'Accepted'
            });
        var f2 = Ext.create('Rally.data.QueryFilter',
            {
                property: 'InprogressDate',
                operator: '>=',
                value: '2014-1-1'
            });
        var f3 = f1.and(f2);
        var f4 = Ext.create('Rally.data.QueryFilter',
            {
                property: 'Iteration.State',
                operator: '=',
                value: 'Committed'
            });
        var f5 = Ext.create('Rally.data.QueryFilter',
            {
                property: 'Iteration.State',
                operator: '=',
                value: 'Accepted'
            });
        var f6 = f4.or(f5);
        var storeFilter = f3.and(f6);
        Ext.create('Rally.data.wsapi.Store', {
            model: 'userstory',
            filters: storeFilter,
            autoLoad: true,
            listeners: {
                load: this._onDataLoaded,
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState', 'PortfolioItem',
                'State', 'AcceptedDate','PlanEstimate', 'CreationDate', 
                'Release', 'Parent', 'InvestmentCategory', 'Iteration',
                'Project', 'Release']
        });
    },

    _onDataLoaded: function(store, data) {
        var records = _.map(data, function(record) {
            //Perform custom actions with the data here
            //Calculations, etc.
            return Ext.apply({
                TaskCount: record.get('Tasks').Count
            }, record.getData());
        });

        this.add({
            xtype: 'rallygrid',
            showPagingToolbar: false,
            showRowActionsColumn: false,
            editable: false,
            store: Ext.create('Rally.data.custom.Store', {
                data: records
            }),
            columnCfgs: [
                {
                    text: 'Investment Category',
                    dataIndex: 'PortfolioItem',
                    renderer: this.renderIC
                },
                {
                    text: 'Portfolio Item',
                    dataIndex: 'PortfolioItem',
                    renderer: this.renderPI
                },
                {
                    xtype: 'templatecolumn',
                    text: 'Story ID',
                    dataIndex: 'FormattedID',
                    width: 100,
                    tpl: Ext.create('Rally.ui.renderer.template.FormattedIDTemplate')
                },
                {
                    text: 'Story Name',
                    dataIndex: 'Name'
                    //flex: 1
                },
                {
                    text: 'Creation Date',
                    dataIndex: 'CreationDate'
                },
                {
                    text: 'Accepted Date',
                    dataIndex: 'AcceptedDate'
                },
                {
                    text: 'Project',
                    dataIndex: 'Project',
                    renderer: this.renderProject
                },
                {
                    text: 'Release',
                    dataIndex: 'Release',
                    renderer: this.renderRelease
                },
                {
                    text: 'Iteration',
                    dataIndex: 'Iteration',
                    renderer: this.renderIteration
                },
                {
                    text: 'Plan Estimate',
                    dataIndex: 'PlanEstimate'
                },
                {
                    text: 'Schedule State',
                    dataIndex: 'ScheduleState'
                },
                {
                    text: 'Iteration State',
                    dataIndex: 'Iteration',
                    renderer: this.renderState
                },
                {
                    text: 'Parent PI Investment Category',
                    dataIndex: 'Parent',
                    renderer: this.renderParentIC
                }
            ]
        });
    },
    
    renderState : function(value,meta,rec,row,col) {
           // console.log("state value: ", value);
            return value ? value.State : value;
    },
    
    renderIC : function(value,meta,rec,row,col) {
            //console.log("IC value: ", value);
            return value ? value.InvestmentCategory : value;
    },
     renderPI : function(value,meta,rec,row,col) {
           // console.log("PI value: ", value);
            return value ? value.Name : value;
        // return ("<a ref=\""+Rally.util.Ref.getUrl(rec.raw.ref)+">"+rec.get("FormattedID")+"</a>");
    },
     renderParentIC : function(value,meta,rec,row,col) {
            //console.log("ParentIC value: ", value);
            return value ? value.PortfolioItem.InvestmentCategory : value;
    },
     renderProject : function(value,meta,rec,row,col) {
            //console.log("Project value: ", value);
            return value ? value.Name : value;
    },
     renderRelease : function(value,meta,rec,row,col) {
            //console.log("Release value: ", value);
            return value ? value.Name : value;
    },
     renderIteration : function(value,meta,rec,row,col) {
            //console.log("Iteration value: ", value);
            return value ? value.Name : value;
    }
});