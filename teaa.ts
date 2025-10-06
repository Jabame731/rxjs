import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import {
  NgxInteractiveOrgChart,
  NgxInteractiveOrgChartTheme,
  OrgChartNode,
} from 'ngx-interactive-org-chart';

// --- ENUMS ---
enum TypeEnum {
  Employee = 'employee',
  Contractor = 'contractor',
  Department = 'department',
  AddButton = 'addButton',
  SplitContainer = 'splitContainer',
  StructuralRoot = 'structuralRoot',
}

enum SideEnum {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

// --- INTERFACE ---
interface ApiResponse {
  readonly id: number;
  readonly name: string;
  readonly title?: string;
  readonly thumbnail?: string;
  readonly type: TypeEnum;
  readonly children?: ApiResponse[];
  readonly side?: SideEnum;
  readonly mainParent?: boolean; // Kept for initial data clarity, but dynamically calculated
}

// --- CONSTANT NODES ---
const LEFT_ADD_BUTTON_NODE: ApiResponse = {
  id: -998,
  name: 'Add Left Member',
  title: 'Add Member',
  type: TypeEnum.AddButton,
  side: SideEnum.Left,
};

const RIGHT_ADD_BUTTON_NODE: ApiResponse = {
  id: -997,
  name: 'Add Right Member',
  title: 'Add Member',
  type: TypeEnum.AddButton,
  side: SideEnum.Right,
};

// --- MODIFIED CONSTANT NODES ---
// These are used when the depth is 4 (5th level) or greater
const LEFT_ADD_BUTTON_NODE_EMPTY: ApiResponse = {
  id: -996,
  name: 'EMPTY', // Changed name
  title: 'Limit Reached',
  type: TypeEnum.AddButton,
  side: SideEnum.Left,
};

const RIGHT_ADD_BUTTON_NODE_EMPTY: ApiResponse = {
  id: -995,
  name: 'EMPTY', // Changed name
  title: 'Limit Reached',
  type: TypeEnum.AddButton,
  side: SideEnum.Right,
};

const MAX_DEPTH_FOR_ADD_BUTTONS = 3;

@Component({
  selector: 'app-geonology',
  standalone: true,
  imports: [NgxInteractiveOrgChart, CommonModule],
  styleUrl: './geonology.component.scss',
  template: `
    <ngx-interactive-org-chart
      [data]="orgChartData() || {}"
      [themeOptions]="themeOptions"
    >
      <ng-template #nodeTemplate let-node="node">
        @let nodeData = node?.data;
        @let isAddButton = nodeData?.type === dataTypeEnum.AddButton;

        @switch (true) {
          @case (
            nodeData?.type === dataTypeEnum.Employee ||
            nodeData?.type === dataTypeEnum.Contractor
          ) {
            @let isContractor = nodeData.type === dataTypeEnum.Contractor;

            <section class="demo__employee">
              <section class="demo__employee-thumbnail">
                <img [src]="nodeData?.thumbnail" />
              </section>
              <section class="demo__employee-details">
                <span class="demo__employee-details-name">{{
                  nodeData?.name
                }}</span>
                <span class="demo__employee-details-position">{{
                  nodeData?.title
                }}</span>
                @if (isContractor) {
                  <small class="demo__employee-details-type">Contractor</small>
                }
              </section>
            </section>
          }

          @case (nodeData?.type === dataTypeEnum.Department) {
            <section class="demo__department">
              <section class="demo__department-details">
                <span class="demo__department-details-name">{{
                  nodeData?.name
                }}</span>
                <span class="demo__department-details-description">
                  {{ node?.descendantsCount }} Members
                </span>
              </section>
            </section>
          }

          @case (isAddButton) {
            <button class="add-member-node-btn">
              {{ nodeData?.name }}
            </button>
          }
        }
      </ng-template>
    </ngx-interactive-org-chart>
  `,
})
export class GeonologyComponent {
  data: ApiResponse = {
    id: 1,
    name: 'CEO',
    title: 'Top Boss',
    thumbnail: 'https://randomuser.me/api/portraits/men/21.jpg',
    type: TypeEnum.Employee,
    children: [
      {
        id: 2,
        name: 'Alice Johnson',
        title: 'Left Manager',
        type: TypeEnum.Employee,
        side: SideEnum.Left,
        thumbnail: 'https://randomuser.me/api/portraits/women/21.jpg',
        children: [], // Alice has 0 children: gets L & R buttons
      },
      {
        id: 3,
        name: 'Bob Smith',
        title: 'Right Manager',
        type: TypeEnum.Employee,
        side: SideEnum.Right,
        thumbnail: 'https://randomuser.me/api/portraits/men/21.jpg',
        children: [
          {
            id: 4,
            name: 'Bob Jr.',
            title: 'Team Lead',
            type: TypeEnum.Employee,
            side: SideEnum.Left, // Bob has 1 Left child: gets only R button
            children: [
              {
                //change the "add left member and "add right member"  member to EMPTY"
                id: 4,
                name: 'Bob Jr.',
                title: 'Team Lead',
                type: TypeEnum.Employee,
                side: SideEnum.Left, // Bob has 1 Left child: gets only R button
                children: [],
              },
              {
                //change the "add left member and "add right member"  member to EMPTY"
                id: 4,
                name: 'Bob Jr.',
                title: 'Team Lead',
                type: TypeEnum.Employee,
                side: SideEnum.Right, // Bob has 1 Left child: gets only R button
                children: [],
              },
            ],
          },
          {
            id: 4,
            name: 'Bob Jr.',
            title: 'Team Lead',
            type: TypeEnum.Employee,
            side: SideEnum.Right, // Bob has 1 Left child: gets only R button
            children: [
              //change the "add left member  member to EMPTY"
              {
                id: 4,
                name: 'Bob Jr.dsfds',
                title: 'Team Lead',
                type: TypeEnum.Employee,
                side: SideEnum.Left, // Bob has 1 Left child: gets only R button
                children: [
                  {
                    id: 4,
                    name: 'Bob Jr.sdfdsfds',
                    title: 'Team Lead',
                    type: TypeEnum.Employee,
                    side: SideEnum.Right,
                    children: [],
                  },
                ],
              },
              {
                //change the "add left member  member to EMPTY"
                id: 4,
                name: 'Bob Jr. rrr',
                title: 'Team Lead',
                type: TypeEnum.Employee,
                side: SideEnum.Right, // Bob has 1 Left child: gets only R button
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  protected readonly orgChartData = signal<OrgChartNode<ApiResponse> | null>(
    null,
  );
  protected readonly dataTypeEnum = TypeEnum;
  protected readonly sideEnum = SideEnum;

  protected readonly themeOptions: NgxInteractiveOrgChartTheme = {
    // ... (Your existing theme options) ...
    node: {
      background: 'white',
      color: 'black',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      outlineColor: '#e0e0e0',
      activeOutlineColor: '#1976d2',
    },
  };

  readonly #setOrgChartData = effect(() => {
    this.orgChartData.set(this.mapDataToOrgChartNode(this.data));
  });

  // NOTE: The isDynamicMainParent remains the same as it correctly excludes the CEO level.
  private isDynamicMainParent(children: ApiResponse[] | undefined): boolean {
    if (!children || children.length !== 2) {
      return false;
    }
    const hasLeft = children.some((c) => c.side === SideEnum.Left);
    const hasRight = children.some((c) => c.side === SideEnum.Right);

    // Returns TRUE only if there are exactly two children, one on the Left and one on the Right.
    return hasLeft && hasRight;
  }

  /**
   * Checks if any of the immediate children have children of their own.
   * This determines if the current node is a true "branching" node, where we should stop
   * injecting Add buttons below it to prevent deep, unnecessary cascades.
   */
  private shouldSkipButtonInjection(
    children: ApiResponse[] | undefined,
  ): boolean {
    if (!children) return false;

    // Skip injection if ANY of the children have their own children (i.e., this is not the last level of management).
    return children.some((c) => c.children && c.children.length > 0);
  }

  public mapDataToOrgChartNode(
    { children, side, mainParent, ...data }: ApiResponse,
    depth: number = 0,
  ): OrgChartNode<ApiResponse> {
    const MAX_DEPTH_TO_RENDER_CHILDREN = 4; // Stop rendering children at the 5th column (Depth 4)
    const MAX_DEPTH_FOR_ADD_BUTTONS = 3; // Last depth to check for adding buttons below it

    // 💥 RULE 1: Absolute Cutoff at Depth 4 (5th column)
    if (depth >= MAX_DEPTH_TO_RENDER_CHILDREN) {
      return {
        id: data.id.toString(),
        name: data.name,
        collapsed: false,
        data: { ...data, mainParent },
        children: [], // Clean slate: no children, no buttons, no deeper recursion.
      };
    }

    // FIX 2: Early exit for structural/injected nodes
    if (
      data.type === TypeEnum.AddButton ||
      data.type === TypeEnum.SplitContainer
    ) {
      return {
        id: data.id.toString(),
        name: data.name,
        collapsed: false,
        style: {
          '--node-background':
            data.type === TypeEnum.SplitContainer ? 'transparent' : '#f0f0f0',
          'box-shadow':
            data.type === TypeEnum.SplitContainer
              ? 'none'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
          outline:
            data.type === TypeEnum.SplitContainer
              ? 'none'
              : '1px solid var(--node-outline-color)',
        },
        data: { ...data },
        children: [],
      };
    }

    // 1. Separate children
    const leftChildren =
      children?.filter((c) => c.side === SideEnum.Left) || [];
    const rightChildren =
      children?.filter((c) => c.side === SideEnum.Right) || [];
    let mappedChildren: OrgChartNode<ApiResponse>[] = [];

    const isParentEligible =
      data.type === TypeEnum.Employee ||
      data.type === TypeEnum.Contractor ||
      data.type === TypeEnum.Department;

    const isExcludingButtons = this.isDynamicMainParent(children);
    const isBranchingNode = this.shouldSkipButtonInjection(children);

    if (isParentEligible) {
      // 3. Recursive mapping for actual members (increment depth for children)
      const mappedLeft: OrgChartNode<ApiResponse>[] = leftChildren.map(
        (child) => this.mapDataToOrgChartNode(child, depth + 1),
      );
      const mappedRight: OrgChartNode<ApiResponse>[] = rightChildren.map(
        (child) => this.mapDataToOrgChartNode(child, depth + 1),
      );

      // 4. Button Injection Logic
      // Skip entirely if it's the CEO-level split or if it's a branching node.
      if (!isExcludingButtons && !isBranchingNode) {
        const isLastLevelForButtons = depth === MAX_DEPTH_FOR_ADD_BUTTONS;

        const leftButtonNode = isLastLevelForButtons
          ? LEFT_ADD_BUTTON_NODE_EMPTY
          : LEFT_ADD_BUTTON_NODE;
        const rightButtonNode = isLastLevelForButtons
          ? RIGHT_ADD_BUTTON_NODE_EMPTY
          : RIGHT_ADD_BUTTON_NODE;

        // Only inject buttons if we are at or above the last level for buttons.
        if (depth <= MAX_DEPTH_FOR_ADD_BUTTONS) {
          // Inject Left Button if space allows (max 5 members)
          if (mappedLeft.length < 5) {
            mappedLeft.push(this.mapDataToOrgChartNode(leftButtonNode));
          }

          // Inject Right Button if space allows
          if (mappedRight.length < 5) {
            mappedRight.push(this.mapDataToOrgChartNode(rightButtonNode));
          }

          // Cleanup: Remove the button if an actual member exists on that side.
          // This applies to both "Add Member" and "EMPTY" buttons.

          if (mappedLeft.some((n) => n?.data?.type !== TypeEnum.AddButton)) {
            const addButtonIndex = mappedLeft.findIndex(
              (n) => n?.data?.type === TypeEnum.AddButton,
            );
            if (addButtonIndex !== -1) {
              mappedLeft.splice(addButtonIndex, 1);
            }
          }

          if (mappedRight.some((n) => n?.data?.type !== TypeEnum.AddButton)) {
            const addButtonIndex = mappedRight.findIndex(
              (n) => n?.data?.type === TypeEnum.AddButton,
            );
            if (addButtonIndex !== -1) {
              mappedRight.splice(addButtonIndex, 1);
            }
          }
        }
      }

      // 5. Create the Structural Split Containers
      const leftContainer: OrgChartNode<ApiResponse> = {
        id: `${data.id}-left`,
        name: 'Left Branch',
        collapsed: false,
        data: {
          id: -1000,
          name: 'Left',
          type: TypeEnum.SplitContainer,
          side: SideEnum.Left,
        } as ApiResponse,
        style: { width: '0px', height: '0px', padding: '0px', border: 'none' },
        children: mappedLeft,
      };

      const rightContainer: OrgChartNode<ApiResponse> = {
        id: `${data.id}-right`,
        name: 'Right Branch',
        collapsed: false,
        data: {
          id: -1001,
          name: 'Right',
          type: TypeEnum.SplitContainer,
          side: SideEnum.Right,
        } as ApiResponse,
        style: { width: '0px', height: '0px', padding: '0px', border: 'none' },
        children: mappedRight,
      };

      if (mappedLeft.length > 0 || mappedRight.length > 0) {
        mappedChildren = [leftContainer, rightContainer];
      } else {
        mappedChildren = [];
      }
    } else {
      // For non-eligible types, just map existing children
      mappedChildren =
        children?.map((child) =>
          this.mapDataToOrgChartNode(child, depth + 1),
        ) || [];
    }

    return {
      id: data.id.toString(),
      name: data.name,
      collapsed: data.type === TypeEnum.Department,

      data: { ...data, mainParent },
      children: mappedChildren,
    };
  }

  // --- MUTATION LOGIC ---

  addMember(parentId: number | undefined, side: SideEnum): void {
    // ... (Mutation logic remains the same) ...
    if (!parentId) {
      console.warn('Cannot add member: Parent ID is undefined.');
      return;
    }

    const newMember: ApiResponse = {
      id: Date.now(),
      name: `New ${side} Member`,
      title: 'New Position',
      thumbnail: 'https://randomuser.me/api/portraits/lego/2.jpg',
      type: TypeEnum.Employee,
      side: side,
    };

    const updatedData = this.findAndAddChild(this.data, parentId, newMember);
    this.data = updatedData;

    this.orgChartData.set(this.mapDataToOrgChartNode(this.data));
  }

  private findAndAddChild(
    currentData: ApiResponse,
    parentId: number,
    newChild: ApiResponse,
  ): ApiResponse {
    if (currentData.id === parentId) {
      const existingChildren = currentData.children || [];

      const childrenOnOtherSide = existingChildren.filter(
        (c) => c.side !== newChild.side,
      );
      const childrenOnTargetSide = existingChildren.filter(
        (c) => c.side === newChild.side,
      );

      if (childrenOnTargetSide.length < 5) {
        return {
          ...currentData,
          children: [...childrenOnOtherSide, ...childrenOnTargetSide, newChild],
        };
      }
      return currentData;
    }

    if (currentData.children) {
      const updatedChildren = currentData.children.map((child) =>
        this.findAndAddChild(child, parentId, newChild),
      );
      return { ...currentData, children: updatedChildren };
    }

    return currentData;
  }
}
