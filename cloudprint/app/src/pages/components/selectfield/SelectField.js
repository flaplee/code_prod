import React, { Component } from 'react';
import Cookies from 'react-cookies';
import { Group, CascadeSelectField } from 'saltui';
class SelectField extends React.Component {

    constructor(props) {
        super(props);

        const t = this;
        t.state = {
            count: t.props.count,
            options: t.props.options,
            columns: t.props.columns,
            value: t.props.value
        };
    }
    
    handleChange(field) {
        let range = [field[0].value, field[2].value]
        if (field[0].value > field[2].value){
            deli.common.notification.toast({
                "text": "请选择正确页码",
                "duration": 1.5
            },function(data){},function(resp){});
        }else{
            this.setState({
                value: field
            });
            this.props.onChange(range);
        }
    }

    formatter(value) {
        return (value.length > 0) ? (value.map((v) => v.text).join('') + '页') : value.map((v) => v.text).join('');
    }

    render() {
        const t = this;
        return (
            <div className={t.props.Name} id={t.props.Name}>
                <Group>
                    <Group.List>
                        <CascadeSelectField label="打印范围" formatter={this.formatter} onSelect={t.handleChange.bind(t)} options={t.state.options} value={t.state.value} placeholder={t.props.placeholder} columns={t.state.columns} tip="" />
                    </Group.List>
                </Group>
            </div>
        );
    }
}

export default SelectField;