import React from "react";

const renderChildren = (children: any) => (
	<ul>
		{children.map((child: any, childIndex: any) => (
			<li
				key={childIndex}
				style={{ marginLeft: "20px" }}
			>
				<p>
					<strong>Name:</strong> {child.name}
				</p>
				<p>
					<strong>Value:</strong> {child.value}
				</p>
				<p>
					<strong>Operation:</strong> {child.op}
				</p>
				{child.children && renderChildren(child.children)}
			</li>
		))}
	</ul>
);

const ValueList = (props: any) => (
	<div>
		{props.identifier.length > 0
			? props.identifier.map((value: any, index: any) => (
					<div
						key={index}
						style={{ marginBottom: "10px" }}
					>
						<p>
							<strong>Name:</strong> {value.name}
						</p>
						<p>
							<strong>Value:</strong> {value.value}
						</p>
						<p>
							<strong>Operation:</strong> {value.op}
						</p>
						{value.children && (
							<div>
								<strong>Children:</strong>
								{renderChildren(value.children)}
							</div>
						)}
					</div>
			  ))
			: "No nodes found"}
	</div>
);

export default ValueList;
